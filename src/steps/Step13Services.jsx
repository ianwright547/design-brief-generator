import { useState } from 'react'

export default function Step13Services({ brief, updateBrief }) {
  const data = brief.servicePages || { services: [] }
  const services = data.services || []
  const [pasteText, setPasteText] = useState('')

  const update = (services) => {
    updateBrief('servicePages', { ...data, services })
  }

  const updateService = (index, field, value) => {
    const updated = services.map((s, i) => i === index ? { ...s, [field]: value } : s)
    update(updated)
  }

  const removeService = (index) => {
    update(services.filter((_, i) => i !== index))
  }

  const parseAndAdd = () => {
    const names = pasteText
      .split(/[\n,]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0)
    if (names.length === 0) return
    const newServices = names.map(name => ({
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, ''),
      description: '',
      sellingPoints: '',
      notes: '',
    }))
    update([...services, ...newServices])
    setPasteText('')
  }

  return (
    <div>
      <h2 className="section-title">Service Pages</h2>
      <p className="section-desc">
        Each service gets its own page — same design feel as the homepage but focused on that
        specific service. Paste your services below, one per line or comma-separated.
      </p>

      {/* Paste input */}
      <div className="card mb-6">
        <label className="input-label">Paste your services</label>
        <textarea
          value={pasteText}
          onChange={e => setPasteText(e.target.value)}
          placeholder={"Roof Replacement\nRoof Repair\nStorm Damage\nGutter Installation\nCommercial Roofing"}
          rows={4}
          className="input-field resize-none font-mono text-sm"
        />
        <button
          onClick={parseAndAdd}
          disabled={!pasteText.trim()}
          className="btn-primary mt-3 text-sm disabled:opacity-30"
        >
          Add {pasteText.split(/[\n,]+/).filter(s => s.trim()).length || 0} Services
        </button>
      </div>

      {/* Service list */}
      {services.length > 0 && (
        <div className="space-y-3">
          {services.map((service, i) => (
            <div key={i} className="card relative group py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-xs font-mono text-zinc-600 w-6 shrink-0">{i + 1}.</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-zinc-200 truncate">{service.name}</span>
                      <span className="text-xs font-mono text-zinc-600">/{service.slug}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeService(i)}
                  className="text-xs text-zinc-600 hover:text-red-400 transition-colors
                             opacity-0 group-hover:opacity-100 shrink-0 ml-2"
                >
                  Remove
                </button>
              </div>

              {/* Optional extras — collapsed by default, edit inline */}
              <div className="mt-2 grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={service.description}
                  onChange={e => updateService(i, 'description', e.target.value)}
                  placeholder="What it covers (optional)"
                  className="input-field text-xs py-1.5"
                />
                <input
                  type="text"
                  value={service.sellingPoints}
                  onChange={e => updateService(i, 'sellingPoints', e.target.value)}
                  placeholder="Selling points (optional)"
                  className="input-field text-xs py-1.5"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {services.length === 0 && (
        <div className="border-2 border-dashed border-surface-4 rounded-xl p-8 text-center">
          <p className="text-zinc-500 text-sm">No services added yet</p>
          <p className="text-zinc-600 text-xs mt-1">Paste your service list above</p>
        </div>
      )}

      {services.length > 0 && (
        <p className="text-xs text-zinc-600 mt-3">
          {services.length} service {services.length === 1 ? 'page' : 'pages'} — slugs auto-generated, edit inline if needed
        </p>
      )}
    </div>
  )
}
