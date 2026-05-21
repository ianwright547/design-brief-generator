const API_KEY_STORAGE = 'design-brief-openai-key'
const MODEL_STORAGE = 'design-brief-openai-model'
const DEFAULT_MODEL = 'gpt-4o-mini'

export function getApiKey() {
  return localStorage.getItem(API_KEY_STORAGE) || ''
}

export function setApiKey(key) {
  if (key) localStorage.setItem(API_KEY_STORAGE, key)
  else localStorage.removeItem(API_KEY_STORAGE)
}

export function getModel() {
  return localStorage.getItem(MODEL_STORAGE) || DEFAULT_MODEL
}

export function setModel(model) {
  localStorage.setItem(MODEL_STORAGE, model || DEFAULT_MODEL)
}

const FIELD_SCHEMA = {
  business: {
    differentiator: 'One sentence on what makes them different from competitors.',
  },
  customer: {
    whoIsSearching: 'Who is searching for this service? Demographic + emotional state. 1-2 sentences.',
    primaryConcern: 'What is the customer most worried about when they call? 1 sentence.',
    deviceSplit: 'Likely mobile vs desktop split with brief reasoning. e.g. "85% mobile - urgent searches on phone".',
  },
  visual: {
    styleDirection: 'One paragraph describing the overall visual direction (mood, vibe, feel).',
    adjectives: 'Array of exactly 5 single-word adjectives describing the brand visual feel.',
  },
  typography: {
    energy: 'Typography energy: e.g. "bold and confident", "quiet and authoritative". 1 line.',
    headlines: 'How headlines should feel: tone, length, attitude. 1-2 lines.',
  },
  color: {
    physicalSpaceFeel: 'What their physical workspace/trucks/uniforms feel like, color-wise. 1-2 lines.',
    brandColors: 'Recommended brand color palette with hex codes and reasoning. 2-3 lines.',
    competitorColors: 'What colors competitors in this space typically use, and what to do differently. 1-2 lines.',
    lightOrDark: 'Light mode, dark mode, or specific tonal direction with reasoning. 1 line.',
    colorHate: 'Colors to actively avoid for this brand and why. 1 line.',
  },
  homepage: {
    heroNotes: 'Notes on hero section approach. 1-2 lines.',
    servicesNotes: 'Notes on how services should be displayed. 1-2 lines.',
    galleryNotes: 'Notes on gallery/work showcase. 1-2 lines.',
    aboutApproach: 'How to handle the about section. 1-2 lines.',
    aboutNotes: 'Additional about section notes. 1 line.',
    contactNotes: 'Notes on contact section approach. 1 line.',
  },
  designSystem: {
    spacing: 'Spacing philosophy: tight, generous, airy, etc. 1 line.',
    corners: 'Corner radius approach: sharp, soft, mixed. 1 line.',
    shadows: 'Shadow treatment: flat, soft, dramatic. 1 line.',
    photoStyle: 'Photo treatment: full-bleed, framed, duotone, etc. 1 line.',
    accentUsage: 'How to use accent colors: sparingly, boldly, etc. 1 line.',
  },
  images: {
    quantity: 'How many photos the site should have (rough number or range). 1 line.',
    quality: 'Photo quality direction: pro shoot, smartphone authentic, mixed, etc. 1 line.',
    proudOf: 'What kind of work/results they should showcase. 1-2 lines.',
  },
  animation: {
    motionFeel: 'Animation feel: subtle, energetic, none, etc. 1 line.',
    lovedExample: 'Example of motion that would fit this brand. 1 line.',
    annoyances: 'Animation patterns to avoid for this brand. 1 line.',
  },
  serviceAreas: {
    areaPageApproach: 'How to handle service area pages. 1-2 lines.',
  },
  blogStrategy: {
    style: 'Blog content style and tone. 1-2 lines.',
    frequency: 'Recommended posting frequency. 1 line.',
  },
}

function buildPrompt(brief, context) {
  const { name, whatYouDo, city, yearsInBusiness, googleRating, googleReviewCount } = brief.business
  return `You are a senior brand and web designer building a design brief for a local service business. Fill in the fields below with specific, concrete, opinionated recommendations. Avoid generic platitudes. Be direct.

BUSINESS:
- Name: ${name || '(unknown)'}
- What they do: ${whatYouDo || '(unknown)'}
- City: ${city || '(unknown)'}
- Years in business: ${yearsInBusiness || 'n/a'}
- Google rating: ${googleRating || 'n/a'} (${googleReviewCount || 'n/a'} reviews)

ADDITIONAL CONTEXT (from user — website copy, GMB info, notes):
${context?.trim() ? context.trim() : '(none provided)'}

Return a single JSON object with this exact shape. Every value must be a string except visual.adjectives which is an array of exactly 5 single-word strings. Keep responses tight — most fields are 1-2 lines.

${JSON.stringify(FIELD_SCHEMA, null, 2)}

Return ONLY valid JSON matching the shape above (field names and nesting identical). Replace each description with the actual generated value.`
}

function mergeOnlyEmpty(existing, incoming) {
  const out = { ...existing }
  for (const key of Object.keys(incoming)) {
    const newVal = incoming[key]
    const oldVal = existing[key]
    if (Array.isArray(newVal)) {
      const isEmpty = !Array.isArray(oldVal) || oldVal.every(v => !v || (typeof v === 'string' && !v.trim()))
      if (isEmpty) out[key] = newVal
    } else if (typeof newVal === 'string') {
      if (!oldVal || !String(oldVal).trim()) out[key] = newVal
    }
  }
  return out
}

export async function autofillBrief({ brief, context, apiKey, model, overwrite = false }) {
  if (!apiKey) throw new Error('OpenAI API key missing. Open Settings and paste your key.')
  if (!brief.business?.name) throw new Error('Add the business name in Step 1 before running autofill.')

  const prompt = buildPrompt(brief, context)

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model || DEFAULT_MODEL,
      response_format: { type: 'json_object' },
      temperature: 0.7,
      messages: [
        { role: 'system', content: 'You generate design brief content for local service businesses. Return strict JSON only.' },
        { role: 'user', content: prompt },
      ],
    }),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`OpenAI error ${res.status}: ${errText.slice(0, 300)}`)
  }

  const data = await res.json()
  const content = data.choices?.[0]?.message?.content
  if (!content) throw new Error('OpenAI returned no content.')

  let generated
  try {
    generated = JSON.parse(content)
  } catch {
    throw new Error('OpenAI returned invalid JSON.')
  }

  const updated = { ...brief }
  for (const section of Object.keys(FIELD_SCHEMA)) {
    if (!generated[section] || typeof generated[section] !== 'object') continue
    updated[section] = overwrite
      ? { ...brief[section], ...generated[section] }
      : mergeOnlyEmpty(brief[section] || {}, generated[section])
  }

  if (brief.business?.city && (!brief.serviceAreas?.primaryCity || !brief.serviceAreas.primaryCity.trim())) {
    updated.serviceAreas = { ...updated.serviceAreas, primaryCity: brief.business.city }
  }

  const filledCount = Object.values(generated).reduce((sum, sec) => {
    if (!sec || typeof sec !== 'object') return sum
    return sum + Object.keys(sec).length
  }, 0)

  return { updated, filledCount, usage: data.usage }
}
