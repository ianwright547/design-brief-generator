import { useState, useEffect, useRef } from 'react'

const CURATED_FONTS = {
  'Serif — Authoritative': [
    { name: 'Playfair Display', style: 'Classic, high-contrast serif' },
    { name: 'DM Serif Display', style: 'Modern, geometric serif display' },
    { name: 'Cormorant Garamond', style: 'Elegant, thin, editorial' },
    { name: 'EB Garamond', style: 'Traditional, book-like, literary' },
    { name: 'Libre Baskerville', style: 'Sturdy, professional serif' },
    { name: 'Lora', style: 'Contemporary serif, well-balanced' },
    { name: 'Merriweather', style: 'Readable serif, slightly condensed' },
    { name: 'Source Serif 4', style: 'Clean, versatile editorial serif' },
    { name: 'Fraunces', style: 'Quirky, variable, old-style' },
  ],
  'Sans — Clean Professional': [
    { name: 'Inter', style: 'Neutral, universal, highly readable' },
    { name: 'DM Sans', style: 'Geometric, modern, friendly' },
    { name: 'Plus Jakarta Sans', style: 'Modern geometric, slightly warm' },
    { name: 'Manrope', style: 'Geometric, modern, versatile' },
    { name: 'Space Grotesk', style: 'Technical, geometric, distinctive' },
    { name: 'Outfit', style: 'Geometric, wide range of weights' },
    { name: 'Sora', style: 'Geometric, slightly futuristic' },
    { name: 'Albert Sans', style: 'Geometric, neutral, clean' },
    { name: 'Urbanist', style: 'Modern, minimal, geometric' },
    { name: 'Figtree', style: 'Friendly geometric sans' },
  ],
  'Sans — Warm Humanist': [
    { name: 'Nunito', style: 'Rounded, friendly, approachable' },
    { name: 'Rubik', style: 'Slightly rounded, versatile' },
    { name: 'Open Sans', style: 'Neutral humanist, highly readable' },
    { name: 'Lato', style: 'Semi-rounded, warm, professional' },
    { name: 'Mulish', style: 'Minimal, elegant sans' },
    { name: 'Karla', style: 'Grotesque, slightly quirky' },
    { name: 'Nunito Sans', style: 'Balanced, clean, friendly' },
  ],
  'Display — Bold Statement': [
    { name: 'Bebas Neue', style: 'All-caps, condensed, bold' },
    { name: 'Oswald', style: 'Condensed, strong, impactful' },
    { name: 'Archivo Black', style: 'Wide, heavy, commanding' },
    { name: 'Anton', style: 'Ultra-bold, condensed display' },
    { name: 'Righteous', style: 'Retro, rounded, bold' },
    { name: 'Dela Gothic One', style: 'Heavy, gothic, dramatic' },
    { name: 'Passion One', style: 'Bold, condensed, energetic' },
  ],
  'Monospace — Technical': [
    { name: 'JetBrains Mono', style: 'Developer-focused, clean mono' },
    { name: 'Space Mono', style: 'Quirky, editorial mono' },
    { name: 'IBM Plex Mono', style: 'Professional, IBM design system' },
    { name: 'Fira Code', style: 'Coding-focused, ligatures' },
  ],
}

const ALL_FONTS = Object.values(CURATED_FONTS).flat()

function loadGoogleFont(fontName) {
  const id = `gfont-${fontName.replace(/\s+/g, '-')}`
  if (document.getElementById(id)) return
  const link = document.createElement('link')
  link.id = id
  link.rel = 'stylesheet'
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@400;700&display=swap`
  document.head.appendChild(link)
}

export default function FontPicker({ label, value, onChange, previewText }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [uploadedFonts, setUploadedFonts] = useState([])
  const dropRef = useRef(null)

  useEffect(() => {
    if (value) loadGoogleFont(value)
  }, [value])

  useEffect(() => {
    const handle = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  const handleUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const name = file.name.replace(/\.(ttf|otf|woff|woff2)$/, '')
    const url = URL.createObjectURL(file)
    const fontFace = new FontFace(name, `url(${url})`)
    fontFace.load().then(loaded => {
      document.fonts.add(loaded)
      setUploadedFonts(prev => [...prev, { name, style: 'Custom upload' }])
      onChange(name)
      setOpen(false)
    }).catch(err => {
      console.error('Font load failed:', err)
    })
  }

  const filteredFonts = search
    ? ALL_FONTS.filter(f =>
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.style.toLowerCase().includes(search.toLowerCase())
      )
    : null

  return (
    <div className="relative" ref={dropRef}>
      <label className="input-label">{label}</label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="input-field text-left flex items-center justify-between"
      >
        <span style={value ? { fontFamily: `"${value}", sans-serif` } : {}}>
          {value || 'Select a font...'}
        </span>
        <span className="text-zinc-500 text-xs">{open ? '▲' : '▼'}</span>
      </button>

      {value && previewText && (
        <div className="mt-2 p-4 bg-surface-2 rounded-lg border border-surface-4">
          <p className="text-2xl text-zinc-100" style={{ fontFamily: `"${value}", sans-serif` }}>
            {previewText}
          </p>
          <p className="text-sm text-zinc-400 mt-1" style={{ fontFamily: `"${value}", sans-serif` }}>
            The quick brown fox jumps over the lazy dog
          </p>
        </div>
      )}

      {open && (
        <div className="absolute z-30 top-full left-0 right-0 mt-1 bg-surface-2 border border-surface-4
                        rounded-xl shadow-2xl shadow-black/40 max-h-[420px] overflow-hidden flex flex-col">
          <div className="p-3 border-b border-surface-4 flex gap-2">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search fonts..."
              className="flex-1 bg-surface-3 border border-surface-4 rounded-lg px-3 py-2 text-sm
                         text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-accent"
              autoFocus
            />
            <label className="btn-secondary cursor-pointer text-xs px-3 flex items-center">
              Upload
              <input
                type="file"
                accept=".ttf,.otf,.woff,.woff2"
                onChange={handleUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="overflow-y-auto flex-1 p-2">
            {/* Uploaded fonts */}
            {uploadedFonts.length > 0 && (
              <div className="mb-2">
                <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold px-2 py-1">
                  Uploaded
                </p>
                {uploadedFonts.map(f => (
                  <button
                    key={f.name}
                    onClick={() => { onChange(f.name); setOpen(false); setSearch('') }}
                    onMouseEnter={() => loadGoogleFont(f.name)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-surface-3 transition-colors
                      ${value === f.name ? 'bg-accent/10 text-accent' : 'text-zinc-300'}`}
                  >
                    <span style={{ fontFamily: `"${f.name}", sans-serif` }}>{f.name}</span>
                    <span className="text-xs text-zinc-500 ml-2">{f.style}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Search results or categorized list */}
            {filteredFonts ? (
              filteredFonts.length > 0 ? (
                filteredFonts.map(f => (
                  <button
                    key={f.name}
                    onClick={() => { onChange(f.name); setOpen(false); setSearch('') }}
                    onMouseEnter={() => loadGoogleFont(f.name)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-surface-3 transition-colors
                      ${value === f.name ? 'bg-accent/10 text-accent' : 'text-zinc-300'}`}
                  >
                    <span style={{ fontFamily: `"${f.name}", sans-serif` }}>{f.name}</span>
                    <span className="text-xs text-zinc-500 ml-2">{f.style}</span>
                  </button>
                ))
              ) : (
                <p className="text-sm text-zinc-600 text-center py-4">No fonts match "{search}"</p>
              )
            ) : (
              Object.entries(CURATED_FONTS).map(([category, fonts]) => (
                <div key={category} className="mb-2">
                  <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold px-2 py-1.5 sticky top-0 bg-surface-2">
                    {category}
                  </p>
                  {fonts.map(f => (
                    <button
                      key={f.name}
                      onClick={() => { onChange(f.name); setOpen(false); setSearch('') }}
                      onMouseEnter={() => loadGoogleFont(f.name)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-surface-3 transition-colors
                        ${value === f.name ? 'bg-accent/10 text-accent' : 'text-zinc-300'}`}
                    >
                      <span style={{ fontFamily: `"${f.name}", sans-serif` }}>{f.name}</span>
                      <span className="text-xs text-zinc-500 ml-2">— {f.style}</span>
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
