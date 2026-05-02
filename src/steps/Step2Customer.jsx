export default function Step2Customer({ brief, updateBrief }) {
  const data = brief.customer
  const update = (field, value) => {
    updateBrief('customer', { ...data, [field]: value })
  }

  const concerns = [
    { id: 'price', label: 'Price', desc: '"Is this going to cost a fortune?"' },
    { id: 'trust', label: 'Trust', desc: '"Are these people legit?"' },
    { id: 'speed', label: 'Speed', desc: '"Can they get here fast?"' },
    { id: 'quality', label: 'Quality', desc: '"Will the work actually be good?"' },
    { id: 'proximity', label: 'Proximity', desc: '"Do they even serve my area?"' },
    { id: 'expertise', label: 'Expertise', desc: '"Do they specialize in my problem?"' },
  ]

  return (
    <div>
      <h2 className="section-title">The Customer</h2>
      <p className="section-desc">
        Not a marketing persona. The actual human Googling this business right now.
      </p>

      <div className="space-y-6">
        <div>
          <label className="input-label">Who is searching for them right now?</label>
          <textarea
            value={data.whoIsSearching}
            onChange={e => update('whoIsSearching', e.target.value)}
            placeholder={"Be specific about the person AND the situation.\n\ne.g., \"Homeowner, 35-55, noticed water stain on ceiling after last rain. Stressed. Googling from phone. Wants someone who answers immediately and can come look at it this week. Comparing 3-4 options from Google.\""}
            rows={4}
            className="input-field resize-none"
          />
          <p className="input-hint">
            Age range. Situation. Urgency level. What triggered the search. This drives every design decision.
          </p>
        </div>

        <div>
          <label className="input-label">Their #1 concern when choosing</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
            {concerns.map(c => (
              <button
                key={c.id}
                type="button"
                onClick={() => update('primaryConcern', c.id)}
                className={`option-card ${data.primaryConcern === c.id ? 'selected' : ''}`}
              >
                <span className="text-sm font-medium text-zinc-200">{c.label}</span>
                <span className="block text-xs text-zinc-500 mt-0.5">{c.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="input-label">What device are they on?</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'mostly-mobile', label: 'Mostly Mobile', desc: '70%+ phone' },
              { id: 'split', label: 'Even Split', desc: '~50/50' },
              { id: 'mostly-desktop', label: 'Mostly Desktop', desc: '70%+ desktop' },
            ].map(d => (
              <button
                key={d.id}
                type="button"
                onClick={() => update('deviceSplit', d.id)}
                className={`option-card ${data.deviceSplit === d.id ? 'selected' : ''}`}
              >
                <span className="text-sm font-medium text-zinc-200">{d.label}</span>
                <span className="block text-xs text-zinc-500 mt-0.5">{d.desc}</span>
              </button>
            ))}
          </div>
          <p className="input-hint">
            If you don't know, pick "Mostly Mobile." You're probably right — 70%+ of local business traffic is mobile.
          </p>
        </div>
      </div>
    </div>
  )
}
