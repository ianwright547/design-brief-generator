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

// ───────────────────────────────────────────────────────────────────
// Enum maps for every choice field. AI MUST pick from these IDs.
// "preferred" is the Thompson-Roofing-style bias default when context is ambiguous.
// ───────────────────────────────────────────────────────────────────
const ENUMS = {
  'customer.primaryConcern': {
    values: ['price', 'trust', 'speed', 'quality', 'proximity', 'expertise'],
    preferred: 'trust',
  },
  'customer.deviceSplit': {
    values: ['mostly-mobile', 'split', 'mostly-desktop'],
    preferred: 'mostly-mobile',
  },
  'visual.styleDirection': {
    values: [
      'clean-professional', 'warm-inviting', 'bold-confident',
      'premium-elevated', 'neighborhood-authentic', 'clinical-trustworthy',
    ],
    preferred: 'bold-confident',
  },
  'typography.energy': {
    values: [
      'strong-serif', 'clean-sans', 'warm-humanist',
      'bold-display', 'mixed-serif-sans', 'neutral-premium',
    ],
    preferred: 'bold-display',
  },
  'typography.headlines': {
    values: ['bold-loud', 'quiet-refined'],
    preferred: 'bold-loud',
  },
  'color.lightOrDark': {
    values: ['light', 'dark', 'mixed'],
    preferred: 'dark',
  },
  'homepage.heroType': {
    values: ['split-immersive', 'full-bleed-cinematic', 'type-forward', 'layered-depth', 'scroll-reveal'],
    preferred: 'full-bleed-cinematic',
  },
  'homepage.servicesDisplay': {
    values: ['scroll-showcase', 'interactive-list', 'masonry-editorial', 'numbered-sequence', 'accordion-expand'],
    preferred: 'numbered-sequence',
  },
  'homepage.galleryDisplay': {
    values: ['full-bleed-scroll', 'horizontal-scroll', 'before-after', 'curated-mosaic'],
    preferred: 'full-bleed-scroll',
  },
  'homepage.aboutApproach': {
    values: ['bold-stat', 'narrative-split', 'timeline'],
    preferred: 'narrative-split',
  },
  'homepage.mapStyle': {
    values: ['dark-mode', 'desaturated', 'standard'],
    preferred: 'dark-mode',
  },
  'homepage.contactFields': {
    values: ['name-phone-message', 'name-email-phone-message', 'name-phone-service-message'],
    preferred: 'name-phone-service-message',
  },
  'designSystem.spacing': {
    values: ['tight', 'medium', 'generous'],
    preferred: 'generous',
  },
  'designSystem.corners': {
    values: ['sharp', 'moderate', 'rounded', 'pill'],
    preferred: 'sharp',
  },
  'designSystem.shadows': {
    values: ['none', 'subtle', 'noticeable'],
    preferred: 'subtle',
  },
  'designSystem.photoStyle': {
    values: ['full-color', 'muted', 'bw'],
    preferred: 'muted',
  },
  'designSystem.accentUsage': {
    values: ['sparing', 'moderate', 'bold'],
    preferred: 'bold',
  },
  'images.quantity': {
    values: ['under-10', '10-25', '25-50', '50+'],
    preferred: '10-25',
  },
  'images.quality': {
    values: ['professional', 'iphone-good', 'needs-work'],
    preferred: 'iphone-good',
  },
  'animation.motionFeel': {
    values: ['subtle-smooth', 'confident-purposeful', 'bold-dramatic'],
    preferred: 'confident-purposeful',
  },
  'mascot.wantsMascot': {
    values: ['yes', 'maybe', 'no'],
    preferred: 'maybe',
  },
  'blogStrategy.style': {
    values: ['expert-casual', 'professional', 'friendly-local'],
    preferred: 'expert-casual',
  },
  'blogStrategy.frequency': {
    values: ['1/week', '2/month', '1/month', 'Batch upfront', 'As needed'],
    preferred: '2/month',
  },
}

// Default ordering preference for homepage.sectionPriority (8 sections).
const DEFAULT_SECTION_PRIORITY = ['hero', 'trust', 'services', 'proof', 'reviews', 'about', 'map', 'contact']
const VALID_SECTIONS = new Set(DEFAULT_SECTION_PRIORITY)

function buildPrompt(brief, context) {
  const { name, whatYouDo, city, yearsInBusiness, googleRating, googleReviewCount, differentiator } = brief.business || {}

  // Build an enum block the model can read inline.
  const enumBlock = Object.entries(ENUMS)
    .map(([path, e]) => `  - ${path}: pick ONE of [${e.values.join(', ')}] (default if unsure: "${e.preferred}")`)
    .join('\n')

  return `You are a senior brand and web designer building a design brief for a local service business. Fill EVERY field. For choice fields, pick ONE valid id from the list. For text fields, write 1-2 specific opinionated lines (no generic platitudes). For references, extract URLs from the context and analyze each.

BIAS / HOUSE STYLE: This studio prefers bold, dark, asymmetric, editorial design. Default to "bold-confident" direction, "bold-display" type, "dark" mode, "full-bleed-cinematic" or "type-forward" heroes, "numbered-sequence" or "masonry-editorial" services, "full-bleed-scroll" gallery, "narrative-split" about, "sharp" corners, "generous" spacing, "muted" photos, "bold" accent, "confident-purposeful" motion, "dark-mode" maps. Override only when the user's context clearly demands a different direction (e.g. dental clinic → clinical-trustworthy + light + clean-sans).

BUSINESS:
- Name: ${name || '(unknown)'}
- What they do: ${whatYouDo || '(unknown)'}
- City / area: ${city || '(unknown)'}
- Years in business: ${yearsInBusiness || 'n/a'}
- Google rating: ${googleRating || 'n/a'} (${googleReviewCount || 'n/a'} reviews)
- Differentiator: ${differentiator || '(unknown)'}

USER CONTEXT (paste of their notes, website copy, references — read carefully):
${context?.trim() ? context.trim() : '(none provided)'}

CHOICE FIELDS — must be one of these exact ids:
${enumBlock}

Also fill:
  - homepage.sectionPriority: array reordering of [hero, trust, services, proof, reviews, about, map, contact] (hero stays first)
  - visual.personality (each 0–100, where 0=left label, 100=right label):
    corporatePersonal (0=Corporate, 100=Personal)
    polishedAuthentic (0=Polished, 100=Raw/Authentic)
    establishedScrappy (0=Established, 100=Scrappy/New)
    luxuryAccessible (0=Luxury, 100=Accessible)
    reservedOpinionated (0=Reserved, 100=Opinionated)
  - visual.adjectives: array of exactly 5 strings. [0]=visual, [1]=visual, [2]=emotional, [3]=any, [4]=what they're NOT (prefix with "NOT "). Banned: "modern", "clean", "professional".
  - references: array of 3-5 objects {url, businessType, taking, ignoring}. If the user listed URLs in context, USE THOSE EXACT URLS. Extract or infer businessType, "taking" (what to steal), and "ignoring".
  - business.differentiator: one specific provable sentence (only if blank).

TEXT FIELDS to fill (1-2 lines each):
  customer.whoIsSearching, color.physicalSpaceFeel, color.brandColors (with hex codes), color.competitorColors, color.colorHate,
  typography.fontLiked,
  homepage.heroNotes, homepage.servicesNotes, homepage.galleryNotes, homepage.aboutNotes, homepage.contactNotes,
  images.proudOf,
  animation.lovedExample, animation.annoyances,
  serviceAreas.primaryCity (use business.city), serviceAreas.areaPageApproach

Return ONE JSON object with this exact shape and nesting. Every choice field value must be a valid id from the lists above.

{
  "business": { "differentiator": "" },
  "customer": { "whoIsSearching": "", "primaryConcern": "", "deviceSplit": "" },
  "visual": {
    "styleDirection": "",
    "personality": { "corporatePersonal": 0, "polishedAuthentic": 0, "establishedScrappy": 0, "luxuryAccessible": 0, "reservedOpinionated": 0 },
    "adjectives": ["", "", "", "", ""]
  },
  "references": [{ "url": "", "businessType": "", "taking": "", "ignoring": "" }],
  "typography": { "energy": "", "headlines": "", "fontLiked": "" },
  "color": { "physicalSpaceFeel": "", "brandColors": "", "competitorColors": "", "lightOrDark": "", "colorHate": "" },
  "homepage": {
    "heroType": "", "heroNotes": "",
    "servicesDisplay": "", "servicesNotes": "",
    "galleryDisplay": "", "galleryNotes": "",
    "aboutApproach": "", "aboutNotes": "",
    "mapStyle": "",
    "contactFields": "", "contactNotes": "",
    "sectionPriority": ["hero", "trust", "services", "proof", "reviews", "about", "map", "contact"]
  },
  "designSystem": { "spacing": "", "corners": "", "shadows": "", "photoStyle": "", "accentUsage": "" },
  "images": { "quantity": "", "quality": "", "proudOf": "" },
  "animation": { "motionFeel": "", "lovedExample": "", "annoyances": "" },
  "mascot": { "wantsMascot": "" },
  "serviceAreas": { "primaryCity": "", "areaPageApproach": "" },
  "blogStrategy": { "style": "", "frequency": "" }
}

Return ONLY this JSON. No prose, no markdown fences.`
}

// ───────────────────────────────────────────────────────────────────
// Validate + merge
// ───────────────────────────────────────────────────────────────────

function isEmpty(v) {
  if (v == null) return true
  if (typeof v === 'string') return !v.trim()
  if (Array.isArray(v)) return v.every(x => isEmpty(x))
  return false
}

function getEnum(path) {
  return ENUMS[path]
}

function validateAndAssign(target, section, key, newVal, overwrite) {
  const path = `${section}.${key}`
  const oldVal = target[section]?.[key]

  // Enum field: must be in valid set, else drop.
  const enumDef = getEnum(path)
  if (enumDef) {
    if (typeof newVal !== 'string') return
    if (!enumDef.values.includes(newVal)) return
    if (!overwrite && !isEmpty(oldVal)) return
    target[section][key] = newVal
    return
  }

  // sectionPriority — must be permutation of the 8 sections.
  if (path === 'homepage.sectionPriority') {
    if (!Array.isArray(newVal)) return
    const filtered = newVal.filter(s => VALID_SECTIONS.has(s))
    const unique = [...new Set(filtered)]
    if (unique.length !== 8) return
    if (!overwrite && Array.isArray(oldVal) && oldVal.length === 8) return
    // Force hero first
    const final = ['hero', ...unique.filter(s => s !== 'hero')]
    target[section][key] = final
    return
  }

  // adjectives — array of 5 strings
  if (path === 'visual.adjectives') {
    if (!Array.isArray(newVal)) return
    const trimmed = newVal.slice(0, 5).map(v => (typeof v === 'string' ? v : ''))
    while (trimmed.length < 5) trimmed.push('')
    const oldIsEmpty = !Array.isArray(oldVal) || oldVal.every(v => isEmpty(v))
    if (!overwrite && !oldIsEmpty) return
    target[section][key] = trimmed
    return
  }

  // personality — object of numbers 0-100
  if (path === 'visual.personality') {
    if (!newVal || typeof newVal !== 'object') return
    const updated = { ...(oldVal || {}) }
    for (const k of Object.keys(newVal)) {
      const num = Number(newVal[k])
      if (!Number.isFinite(num)) continue
      const clamped = Math.max(0, Math.min(100, Math.round(num)))
      const wasDefault = updated[k] == null || updated[k] === 50
      if (overwrite || wasDefault) updated[k] = clamped
    }
    target[section][key] = updated
    return
  }

  // Plain text
  if (typeof newVal === 'string') {
    if (!overwrite && !isEmpty(oldVal)) return
    target[section][key] = newVal
  }
}

function mergeReferences(existing, incoming, overwrite) {
  if (!Array.isArray(incoming) || incoming.length === 0) return existing
  const cleaned = incoming
    .filter(r => r && typeof r === 'object')
    .map(r => ({
      url: String(r.url || '').trim(),
      businessType: String(r.businessType || '').trim(),
      taking: String(r.taking || '').trim(),
      ignoring: String(r.ignoring || '').trim(),
    }))
    .filter(r => r.url || r.businessType || r.taking || r.ignoring)

  if (cleaned.length === 0) return existing

  // If existing has any user-entered URLs and we're not overwriting, keep existing.
  const hasUserData = Array.isArray(existing) && existing.some(r => r && (r.url || r.taking))
  if (hasUserData && !overwrite) return existing
  return cleaned
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
      temperature: 0.6,
      messages: [
        { role: 'system', content: 'You generate design brief content for local service businesses. Return strict JSON only. Every choice field must be a valid id from the provided enum list.' },
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

  // Deep-clone brief so we don't mutate React state directly.
  const updated = JSON.parse(JSON.stringify(brief))
  let filledCount = 0

  for (const section of Object.keys(generated)) {
    if (section === 'references') {
      const before = JSON.stringify(updated.references || [])
      updated.references = mergeReferences(updated.references || [], generated.references, overwrite)
      if (JSON.stringify(updated.references) !== before) filledCount += updated.references.length
      continue
    }

    const sec = generated[section]
    if (!sec || typeof sec !== 'object') continue
    if (!updated[section] || typeof updated[section] !== 'object') updated[section] = {}

    for (const key of Object.keys(sec)) {
      const before = JSON.stringify(updated[section][key])
      validateAndAssign(updated, section, key, sec[key], overwrite)
      if (JSON.stringify(updated[section][key]) !== before) filledCount++
    }
  }

  // Always seed primaryCity from business.city if still empty.
  if (brief.business?.city && isEmpty(updated.serviceAreas?.primaryCity)) {
    updated.serviceAreas = { ...(updated.serviceAreas || {}), primaryCity: brief.business.city }
    filledCount++
  }

  return { updated, filledCount, usage: data.usage }
}
