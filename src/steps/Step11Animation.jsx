export default function Step11Animation({ brief, updateBrief }) {
  const data = brief.animation
  const update = (field, value) => {
    updateBrief('animation', { ...data, [field]: value })
  }

  return (
    <div>
      <h2 className="section-title">Animation & Motion</h2>
      <p className="section-desc">
        You asked for motion that feels crafted, not decorative. That means I need to know
        what "crafted" looks like to you. Don't skip this — if I guess, I'll play it safe,
        and safe is what you're trying to avoid.
      </p>

      <div className="space-y-6">
        <div>
          <label className="input-label">Overall Motion Feel</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: 'subtle-smooth',
                label: 'Subtle & Smooth',
                desc: 'Refined micro-interactions. Gentle fades, slight movements. The kind you feel but barely notice.',
              },
              {
                id: 'confident-purposeful',
                label: 'Confident & Purposeful',
                desc: 'Noticeable but not overwhelming. Staggered reveals, smooth scroll transitions, clear choreography.',
              },
              {
                id: 'bold-dramatic',
                label: 'Bold & Dramatic',
                desc: 'Statement-making. Large-scale transitions, parallax depth, elements that command attention.',
              },
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                onClick={() => update('motionFeel', opt.id)}
                className={`option-card ${data.motionFeel === opt.id ? 'selected' : ''}`}
              >
                <span className="text-sm font-semibold text-zinc-100">{opt.label}</span>
                <span className="block text-xs text-zinc-400 mt-1.5 leading-relaxed">{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="input-label">A site whose motion you loved</label>
          <textarea
            value={data.lovedExample}
            onChange={e => update('lovedExample', e.target.value)}
            placeholder={"URL + describe exactly what you liked about the motion.\n\ne.g., \"https://example.com — the way sections slide into view as you scroll, each element entering with a slight delay. The hero text animates in word-by-word. The gallery images have a subtle parallax effect.\"\n\nThe more specific, the better. \"Smooth animations\" tells me nothing."}
            rows={4}
            className="input-field resize-none"
          />
          <p className="input-hint">
            If you can't name a specific site, describe the feeling you want:
            "Like turning pages in a high-end magazine" or "Like a slow camera pan across a space."
          </p>
        </div>

        <div>
          <label className="input-label">Motion that annoys you</label>
          <textarea
            value={data.annoyances}
            onChange={e => update('annoyances', e.target.value)}
            placeholder={"What to avoid.\n\ne.g., \"Parallax that makes me dizzy. Anything that makes the page feel slow. Pop-in animations that trigger every time you scroll past. Typing animations.\""}
            rows={3}
            className="input-field resize-none"
          />
          <p className="input-hint">
            Knowing what you hate is as useful as knowing what you want.
          </p>
        </div>
      </div>
    </div>
  )
}
