export default function Step7Color({ brief, updateBrief }) {
  const data = brief.color
  const update = (field, value) => {
    updateBrief('color', { ...data, [field]: value })
  }

  return (
    <div>
      <h2 className="section-title">Color System</h2>
      <p className="section-desc">
        Your neutrals are 80% of the site's visual real estate. The accent color is just punctuation.
        Get the neutrals right first.
      </p>

      <div className="space-y-6">
        <div>
          <label className="input-label">What does the physical space look/feel like?</label>
          <textarea
            value={data.physicalSpaceFeel}
            onChange={e => update('physicalSpaceFeel', e.target.value)}
            placeholder={"Describe the actual business location — colors, materials, lighting, vibe.\n\ne.g., \"Warm wood tones, exposed brick, soft pendant lighting. Feels like a high-end coffee shop — warm, natural, not sterile.\"\n\nOr: \"Clean white walls, stainless steel equipment, bright fluorescent lighting. Clinical but modern.\""}
            rows={4}
            className="input-field resize-none"
          />
          <p className="input-hint">
            The website should feel like an extension of walking through the door. This grounds the palette in reality.
          </p>
        </div>

        <div>
          <label className="input-label">Existing Brand Colors</label>
          <input
            type="text"
            value={data.brandColors}
            onChange={e => update('brandColors', e.target.value)}
            placeholder={"Hex values: \"#2B5F8A, #F4A142\" — or \"none yet, open to suggestions\""}
            className="input-field"
          />
          <p className="input-hint">
            If you have brand colors, give exact hex codes. "Our blue" is not specific enough.
          </p>
        </div>

        <div>
          <label className="input-label">What colors do competitors use?</label>
          <textarea
            value={data.competitorColors}
            onChange={e => update('competitorColors', e.target.value)}
            placeholder={"List the dominant colors of 3-4 competitors so we can differentiate.\n\ne.g., \"Every roofer in our area uses red/orange + dark gray. Every dentist uses blue.\""}
            rows={3}
            className="input-field resize-none"
          />
          <p className="input-hint">
            If every competitor uses the same color, that's your opportunity to stand out by avoiding it entirely.
          </p>
        </div>

        <div>
          <label className="input-label">Light or Dark Dominant?</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                id: 'light',
                label: 'Light',
                desc: 'White/cream backgrounds, dark text',
                preview: 'bg-zinc-100 text-zinc-900',
              },
              {
                id: 'dark',
                label: 'Dark',
                desc: 'Dark/black backgrounds, light text',
                preview: 'bg-zinc-900 text-zinc-100',
              },
              {
                id: 'mixed',
                label: 'Mixed',
                desc: 'Alternating light/dark sections',
                preview: 'bg-gradient-to-b from-zinc-900 to-zinc-200 text-zinc-400',
              },
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                onClick={() => update('lightOrDark', opt.id)}
                className={`option-card ${data.lightOrDark === opt.id ? 'selected' : ''}`}
              >
                <div className={`w-full h-12 rounded-md mb-2 ${opt.preview} flex items-center justify-center text-xs font-medium`}>
                  Aa
                </div>
                <span className="text-sm font-medium text-zinc-200">{opt.label}</span>
                <span className="block text-xs text-zinc-500 mt-0.5">{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="input-label">Color you absolutely hate</label>
          <input
            type="text"
            value={data.colorHate}
            onChange={e => update('colorHate', e.target.value)}
            placeholder={"e.g., \"Not the generic SaaS purple. No teal. Nothing neon.\""}
            className="input-field"
          />
          <p className="input-hint">
            Knowing what to avoid is as useful as knowing what to use.
          </p>
        </div>
      </div>
    </div>
  )
}
