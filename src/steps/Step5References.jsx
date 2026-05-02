import { useState, useRef } from 'react'

export default function Step5References({ brief, updateBrief }) {
  const refs = brief.references
  const htmlFiles = brief.htmlReferences?.files || []
  const [htmlLoading, setHtmlLoading] = useState(false)
  const htmlFileRef = useRef(null)

  const updateRef = (index, field, value) => {
    const updated = refs.map((r, i) => i === index ? { ...r, [field]: value } : r)
    updateBrief('references', updated)
  }

  const addRef = () => {
    updateBrief('references', [...refs, { url: '', businessType: '', taking: '', ignoring: '' }])
  }

  const removeRef = (index) => {
    if (refs.length <= 1) return
    updateBrief('references', refs.filter((_, i) => i !== index))
  }

  return (
    <div>
      <h2 className="section-title">Website References</h2>
      <p className="section-desc">
        3-4 sites that do specific things you want to steal. Not sites you "like." Sites where you can point
        to specific elements and say "that."
      </p>

      <div className="card mb-6">
        <h3 className="text-sm font-semibold text-zinc-300 mb-3">Rules for good references</h3>
        <ul className="text-xs text-zinc-500 space-y-1.5">
          <li>
            <span className="text-accent mr-1.5">1</span>
            At least 1 from the same industry (different city)
          </li>
          <li>
            <span className="text-accent mr-1.5">2</span>
            At least 1 from a completely different business type
          </li>
          <li>
            <span className="text-accent mr-1.5">3</span>
            Never reference direct competitors in the same city — you'll become a clone
          </li>
          <li>
            <span className="text-accent mr-1.5">4</span>
            Check the build quality — if the reference is itself a template, you're referencing mediocrity
          </li>
        </ul>
      </div>

      <div className="space-y-6">
        {refs.map((ref, i) => (
          <div key={i} className="card relative group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-zinc-500">Reference {i + 1}</span>
              {refs.length > 1 && (
                <button
                  onClick={() => removeRef(i)}
                  className="text-xs text-zinc-600 hover:text-red-400 transition-colors
                             opacity-0 group-hover:opacity-100"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <label className="input-label">URL</label>
                <input
                  type="url"
                  value={ref.url}
                  onChange={e => updateRef(i, 'url', e.target.value)}
                  placeholder="https://example.com"
                  className="input-field"
                />
              </div>

              <div>
                <label className="input-label">Business Type</label>
                <input
                  type="text"
                  value={ref.businessType}
                  onChange={e => updateRef(i, 'businessType', e.target.value)}
                  placeholder="e.g., Architecture firm in Portland"
                  className="input-field"
                />
              </div>

              <div>
                <label className="input-label">What I'm taking from this</label>
                <textarea
                  value={ref.taking}
                  onChange={e => updateRef(i, 'taking', e.target.value)}
                  placeholder={"Be specific: \"the way they show project photos in a full-bleed masonry layout\" or \"the oversized serif headlines with tight tracking\" or \"the dark navigation bar with minimal links\""}
                  rows={3}
                  className="input-field resize-none"
                />
              </div>

              <div>
                <label className="input-label">What I'm ignoring</label>
                <textarea
                  value={ref.ignoring}
                  onChange={e => updateRef(i, 'ignoring', e.target.value)}
                  placeholder={"e.g., \"the color palette — too cold for us\" or \"the animation is too much\""}
                  rows={2}
                  className="input-field resize-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {refs.length < 5 && (
        <button
          onClick={addRef}
          className="btn-secondary w-full mt-4 text-sm"
        >
          + Add Another Reference
        </button>
      )}

      {/* HTML Reference Upload */}
      <div className="mt-12 pt-8 border-t border-surface-4/50">
        <h3 className="section-title text-xl">HTML Site References</h3>
        <p className="section-desc">
          Upload saved HTML files from competitor or inspiration sites. Use your browser's
          "Save As" (Ctrl+S) to save a page, then upload the .html file here. Claude will
          see the actual structure, layout patterns, and code — not just a screenshot.
        </p>

        <div className="flex gap-3 mb-4">
          <label className="btn-secondary cursor-pointer inline-flex items-center gap-2 text-sm">
            <span>{htmlLoading ? 'Reading...' : 'Upload HTML Files'}</span>
            <input
              ref={htmlFileRef}
              type="file"
              accept=".html,.htm"
              multiple
              onChange={async (e) => {
                const files = Array.from(e.target.files || [])
                if (!files.length) return
                setHtmlLoading(true)
                const newFiles = []
                for (const file of files) {
                  const text = await file.text()
                  const preview = text.slice(0, 500)
                  const sizeKb = Math.round(file.size / 1024)
                  newFiles.push({
                    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
                    name: file.name,
                    sizeKb,
                    preview,
                    content: text,
                    notes: '',
                  })
                }
                updateBrief('htmlReferences', {
                  files: [...htmlFiles, ...newFiles],
                })
                setHtmlLoading(false)
                if (htmlFileRef.current) htmlFileRef.current.value = ''
              }}
              className="hidden"
              disabled={htmlLoading}
            />
          </label>
        </div>

        {htmlFiles.length > 0 && (
          <div className="space-y-3">
            {htmlFiles.map((file, i) => (
              <div key={file.id} className="card group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-accent bg-accent/10 px-2 py-0.5 rounded">HTML</span>
                    <span className="text-sm font-medium text-zinc-200">{file.name}</span>
                    <span className="text-xs text-zinc-600">{file.sizeKb} KB</span>
                  </div>
                  <button
                    onClick={() => {
                      updateBrief('htmlReferences', {
                        files: htmlFiles.filter(f => f.id !== file.id),
                      })
                    }}
                    className="text-xs text-zinc-600 hover:text-red-400 transition-colors
                               opacity-0 group-hover:opacity-100"
                  >
                    Remove
                  </button>
                </div>
                <pre className="text-[10px] text-zinc-500 bg-surface-0 rounded p-2 overflow-hidden max-h-16 font-mono">
                  {file.preview}...
                </pre>
                <input
                  type="text"
                  value={file.notes}
                  onChange={e => {
                    const updated = htmlFiles.map(f =>
                      f.id === file.id ? { ...f, notes: e.target.value } : f
                    )
                    updateBrief('htmlReferences', { files: updated })
                  }}
                  placeholder={"What to take from this site — e.g., \"their services layout\" or \"how they handle the hero\""}
                  className="input-field mt-2 text-sm"
                />
              </div>
            ))}
          </div>
        )}

        {htmlFiles.length === 0 && (
          <div className="border-2 border-dashed border-surface-4 rounded-xl p-8 text-center">
            <p className="text-zinc-500 text-sm">No HTML files uploaded yet</p>
            <p className="text-zinc-600 text-xs mt-1">
              Save competitor sites with Ctrl+S in your browser, then upload the .html files here
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
