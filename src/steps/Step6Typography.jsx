import FontPicker from '../components/FontPicker'

const TYPE_ENERGIES = [
  {
    id: 'strong-serif',
    label: 'Strong Serif',
    desc: 'Authority, establishment, trust',
    best: 'Law, real estate, upscale dining, boutique',
  },
  {
    id: 'clean-sans',
    label: 'Clean Sans',
    desc: 'Clarity, professionalism, accessibility',
    best: 'Medical, dental, modern trades, fitness',
  },
  {
    id: 'warm-humanist',
    label: 'Warm Humanist',
    desc: 'Approachability, friendliness, real',
    best: 'Family businesses, salons, cafes',
  },
  {
    id: 'bold-display',
    label: 'Bold Display',
    desc: 'Personality, confidence, energy',
    best: 'Gyms, BBQ joints, auto, breweries',
  },
  {
    id: 'mixed-serif-sans',
    label: 'Mixed Serif/Sans',
    desc: 'Sophistication, visual interest, editorial',
    best: 'High-end anything, editorial-feeling sites',
  },
  {
    id: 'neutral-premium',
    label: 'Neutral Premium',
    desc: 'Clean, invisible, let content lead',
    best: 'Tech-forward, minimalist brands',
  },
]

export default function Step6Typography({ brief, updateBrief }) {
  const data = brief.typography
  const update = (field, value) => {
    updateBrief('typography', { ...data, [field]: value })
  }

  const businessName = brief.business?.name || 'Your Business Name'

  return (
    <div>
      <h2 className="section-title">Typography</h2>
      <p className="section-desc">
        Typography is 80% of whether a site looks "designed" or "generated."
        Don't rush this — it's the single highest-impact visual decision.
      </p>

      {/* Type energy */}
      <div className="mb-8">
        <label className="input-label">Typographic Energy</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
          {TYPE_ENERGIES.map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => update('energy', t.id)}
              className={`option-card ${data.energy === t.id ? 'selected' : ''}`}
            >
              <span className="text-sm font-semibold text-zinc-100">{t.label}</span>
              <span className="block text-xs text-zinc-400 mt-1">{t.desc}</span>
              <span className="block text-[10px] text-zinc-600 mt-1">Best for: {t.best}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Headlines */}
      <div className="mb-8">
        <label className="input-label">Headlines should feel</label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'bold-loud', label: 'Bold & Loud', desc: 'Large, dominant, commanding attention' },
            { id: 'quiet-refined', label: 'Quiet & Refined', desc: 'Integrated, subtle, elegant' },
          ].map(h => (
            <button
              key={h.id}
              type="button"
              onClick={() => update('headlines', h.id)}
              className={`option-card ${data.headlines === h.id ? 'selected' : ''}`}
            >
              <span className="text-sm font-semibold text-zinc-100">{h.label}</span>
              <span className="block text-xs text-zinc-400 mt-1">{h.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Font reference */}
      <div className="mb-8">
        <label className="input-label">A site whose type you like (optional)</label>
        <input
          type="text"
          value={data.fontLiked}
          onChange={e => update('fontLiked', e.target.value)}
          placeholder={"URL or description \u2014 e.g., \"stripe.com \u2014 clean, geometric, slightly wide\" or \"the serif energy of Aesop's website\""}
          className="input-field"
        />
        <p className="input-hint">{"If you don't know font names, just point to a site. That's enough."}</p>
      </div>

      {/* Font pickers */}
      <div className="space-y-6">
        <FontPicker
          label="Heading Font (optional — or let me choose based on your energy pick)"
          value={data.headingFont}
          onChange={v => update('headingFont', v)}
          previewText={businessName}
        />

        <FontPicker
          label="Body Font (optional)"
          value={data.bodyFont}
          onChange={v => update('bodyFont', v)}
          previewText="The quick brown fox jumps over the lazy dog. Quality craftsmanship you can trust."
        />
      </div>
    </div>
  )
}
