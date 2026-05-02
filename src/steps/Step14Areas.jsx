import { useState } from 'react'

export default function Step14Areas({ brief, updateBrief }) {
  const data = brief.serviceAreas || { primaryCity: '', areas: [], areaPageApproach: '' }
  const areas = data.areas || []
  const [pasteText, setPasteText] = useState('')

  const update = (field, value) => {
    updateBrief('serviceAreas', { ...data, [field]: value })
  }

  const updateArea = (index, field, value) => {
    const updated = areas.map((a, i) => i === index ? { ...a, [field]: value } : a)
    update('areas', updated)
  }

  const removeArea = (index) => {
    update('areas', areas.filter((_, i) => i !== index))
  }

  const parseAndAdd = () => {
    const cities = pasteText
      .split(/[\n,]+/)
      .map(c => c.trim())
      .filter(c => c.length > 0)
    if (cities.length === 0) return
    const newAreas = cities.map(city => ({
      city,
      slug: city.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, ''),
      localDetails: '',
      servicesFocus: '',
    }))
    update('areas', [...areas, ...newAreas])
    setPasteText('')
  }

  return (
    <div>
      <h2 className="section-title">Service Area Pages</h2>
      <p className="section-desc">
        A page for each city or area you serve. These rank for "[service] in [city]" searches.
        Paste your cities below, one per line or comma-separated.
      </p>

      <div className="space-y-4 mb-6">
        <div>
          <label className="input-label">Primary City / HQ Location</label>
          <input
            type="text"
            value={data.primaryCity}
            onChange={e => update('primaryCity', e.target.value)}
            placeholder="e.g., Austin, TX"
            className="input-field"
          />
        </div>

        <div>
          <label className="input-label">Area page approach</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'full-page', label: 'Full Unique Page', desc: 'Each area gets a fully designed page with unique content' },
              { id: 'template-custom', label: 'Template + Custom', desc: 'Same layout, unique copy and local info per area' },
              { id: 'hub-spoke', label: 'Hub & Spoke', desc: 'One main areas page linking to lighter city pages' },
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                onClick={() => update('areaPageApproach', opt.id)}
                className={`option-card ${data.areaPageApproach === opt.id ? 'selected' : ''}`}
              >
                <span className="text-sm font-medium text-zinc-200">{opt.label}</span>
                <span className="block text-xs text-zinc-500 mt-0.5">{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Paste input */}
      <div className="card mb-6">
        <label className="input-label">Paste your cities / areas</label>
        <textarea
          value={pasteText}
          onChange={e => setPasteText(e.target.value)}
          placeholder={"Round Rock, TX\nCedar Park, TX\nGeorgetown, TX\nPflugerville, TX\nLeander, TX"}
          rows={4}
          className="input-field resize-none font-mono text-sm"
        />
        <button
          onClick={parseAndAdd}
          disabled={!pasteText.trim()}
          className="btn-primary mt-3 text-sm disabled:opacity-30"
        >
          Add {pasteText.split(/[\n,]+/).filter(c => c.trim()).length || 0} Areas
        </button>
      </div>

      {/* Area list */}
      {areas.length > 0 && (
        <div className="space-y-3">
          {areas.map((area, i) => (
            <div key={i} className="card relative group py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-xs font-mono text-zinc-600 w-6 shrink-0">{i + 1}.</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-zinc-200 truncate">{area.city}</span>
                      <span className="text-xs font-mono text-zinc-600">/areas/{area.slug}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeArea(i)}
                  className="text-xs text-zinc-600 hover:text-red-400 transition-colors
                             opacity-0 group-hover:opacity-100 shrink-0 ml-2"
                >
                  Remove
                </button>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={area.localDetails}
                  onChange={e => updateArea(i, 'localDetails', e.target.value)}
                  placeholder="Local details (optional)"
                  className="input-field text-xs py-1.5"
                />
                <input
                  type="text"
                  value={area.servicesFocus}
                  onChange={e => updateArea(i, 'servicesFocus', e.target.value)}
                  placeholder="Services to highlight (optional)"
                  className="input-field text-xs py-1.5"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {areas.length === 0 && (
        <div className="border-2 border-dashed border-surface-4 rounded-xl p-8 text-center">
          <p className="text-zinc-500 text-sm">No areas added yet</p>
          <p className="text-zinc-600 text-xs mt-1">Paste your city list above</p>
        </div>
      )}

      {areas.length > 0 && (
        <p className="text-xs text-zinc-600 mt-3">
          {areas.length} area {areas.length === 1 ? 'page' : 'pages'} — slugs auto-generated
        </p>
      )}
    </div>
  )
}
