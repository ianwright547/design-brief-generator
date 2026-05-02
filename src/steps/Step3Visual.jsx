import SliderInput from '../components/SliderInput'

const STYLE_DIRECTIONS = [
  {
    id: 'clean-professional',
    label: 'Clean Professional',
    desc: 'Structured, whitespace, muted colors, clear hierarchy',
    best: 'Law, accounting, financial, medical',
  },
  {
    id: 'warm-inviting',
    label: 'Warm & Inviting',
    desc: 'Rich photography, warm tones, textured, approachable',
    best: 'Restaurants, salons, bakeries, boutiques',
  },
  {
    id: 'bold-confident',
    label: 'Bold & Confident',
    desc: 'Strong type, dark backgrounds, high contrast, visual weight',
    best: 'Contractors, gyms, auto, trades',
  },
  {
    id: 'premium-elevated',
    label: 'Premium Elevated',
    desc: 'Minimal, spacious, restrained color, elegant type',
    best: 'High-end dental, med spa, architecture, luxury',
  },
  {
    id: 'neighborhood-authentic',
    label: 'Neighborhood Authentic',
    desc: 'Friendly, personality-driven, slightly imperfect, handmade touches',
    best: 'Coffee shops, local services, family businesses',
  },
  {
    id: 'clinical-trustworthy',
    label: 'Clinical Trustworthy',
    desc: 'Clean, calming, organized, reassuring palette',
    best: 'Healthcare, therapy, veterinary, specialists',
  },
]

export default function Step3Visual({ brief, updateBrief }) {
  const data = brief.visual
  const update = (field, value) => {
    updateBrief('visual', { ...data, [field]: value })
  }
  const updatePersonality = (key, value) => {
    updateBrief('visual', {
      ...data,
      personality: { ...data.personality, [key]: value },
    })
  }
  const updateAdjective = (index, value) => {
    const adj = [...data.adjectives]
    adj[index] = value
    updateBrief('visual', { ...data, adjectives: adj })
  }

  return (
    <div>
      <h2 className="section-title">Visual Direction</h2>
      <p className="section-desc">
        This sets the entire visual tone. Don't pick what sounds nice — pick what matches the business and the customer's expectation.
      </p>

      {/* Style Direction */}
      <div className="mb-8">
        <label className="input-label">Style Direction</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
          {STYLE_DIRECTIONS.map(s => (
            <button
              key={s.id}
              type="button"
              onClick={() => update('styleDirection', s.id)}
              className={`option-card ${data.styleDirection === s.id ? 'selected' : ''}`}
            >
              <span className="text-sm font-semibold text-zinc-100">{s.label}</span>
              <span className="block text-xs text-zinc-400 mt-1">{s.desc}</span>
              <span className="block text-[10px] text-zinc-600 mt-1.5">Best for: {s.best}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Personality Spectrum */}
      <div className="mb-8">
        <label className="input-label">Brand Personality Spectrum</label>
        <p className="input-hint mb-4">
          Drag each slider. The position matters more than the label — "70% personal, 30% corporate" gives me
          real direction.
        </p>
        <div className="card">
          <SliderInput
            leftLabel="Corporate"
            rightLabel="Personal"
            value={data.personality.corporatePersonal}
            onChange={v => updatePersonality('corporatePersonal', v)}
          />
          <SliderInput
            leftLabel="Polished"
            rightLabel="Raw / Authentic"
            value={data.personality.polishedAuthentic}
            onChange={v => updatePersonality('polishedAuthentic', v)}
          />
          <SliderInput
            leftLabel="Established"
            rightLabel="Scrappy / New"
            value={data.personality.establishedScrappy}
            onChange={v => updatePersonality('establishedScrappy', v)}
          />
          <SliderInput
            leftLabel="Luxury"
            rightLabel="Accessible"
            value={data.personality.luxuryAccessible}
            onChange={v => updatePersonality('luxuryAccessible', v)}
          />
          <SliderInput
            leftLabel="Reserved"
            rightLabel="Opinionated"
            value={data.personality.reservedOpinionated}
            onChange={v => updatePersonality('reservedOpinionated', v)}
          />
        </div>
      </div>

      {/* Adjectives */}
      <div>
        <label className="input-label">Design Adjectives (exactly 5)</label>
        <p className="input-hint mb-3">
          First 2 must be visual. Third must be emotional. Fifth is what you're NOT.
          Banned words: "modern," "clean," "professional" — they mean nothing.
        </p>
        <div className="space-y-2">
          {[
            { idx: 0, placeholder: 'Visual adjective — e.g., "sharp," "airy," "dense," "textured"', hint: 'VISUAL' },
            { idx: 1, placeholder: 'Visual adjective — e.g., "dark," "spacious," "layered"', hint: 'VISUAL' },
            { idx: 2, placeholder: 'Emotional adjective — e.g., "confident," "trustworthy," "rebellious"', hint: 'EMOTIONAL' },
            { idx: 3, placeholder: 'Any adjective — e.g., "editorial," "architectural," "handmade"', hint: 'ANY' },
            { idx: 4, placeholder: 'What you\'re NOT — e.g., "NOT playful," "NOT corporate," "NOT minimal"', hint: 'ANTI' },
          ].map(({ idx, placeholder, hint }) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-zinc-600 w-16 flex-shrink-0 text-right">
                {hint}
              </span>
              <input
                type="text"
                value={data.adjectives[idx]}
                onChange={e => updateAdjective(idx, e.target.value)}
                placeholder={placeholder}
                className="input-field flex-1"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
