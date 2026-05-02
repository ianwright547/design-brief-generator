import ImageUploader from '../components/ImageUploader'

export default function Step10Images({ brief, updateBrief }) {
  const data = brief.images

  const update = (field, value) => {
    updateBrief('images', { ...data, [field]: value })
  }

  return (
    <div>
      <h2 className="section-title">Work Photos & Images</h2>
      <p className="section-desc">
        Upload a .zip of the client's work photos, team photos, space photos.
        Star the ones that are hero/feature candidates. These are the most important
        visual asset — a $50k design with stock photos looks like a $500 template.
      </p>

      <ImageUploader
        images={data.photos}
        onChange={(photos) => updateBrief('images', { ...data, photos })}
        showFavorites={true}
      />

      <div className="mt-8 space-y-5">
        <div>
          <label className="input-label">How many usable images total?</label>
          <div className="flex gap-2">
            {['under-10', '10-25', '25-50', '50+'].map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => update('quantity', opt)}
                className={`tag cursor-pointer ${data.quantity === opt ? 'border-accent text-accent' : 'hover:border-zinc-500'}`}
              >
                {opt.replace('-', '–')}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="input-label">Image Quality</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'professional', label: 'Professional', desc: 'Hired a photographer' },
              { id: 'iphone-good', label: 'iPhone-but-Good', desc: 'Well-lit, decent composition' },
              { id: 'needs-work', label: 'Needs Work', desc: 'Dark, blurry, or inconsistent' },
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                onClick={() => update('quality', opt.id)}
                className={`option-card ${data.quality === opt.id ? 'selected' : ''}`}
              >
                <span className="text-sm font-medium text-zinc-200">{opt.label}</span>
                <span className="block text-xs text-zinc-500 mt-0.5">{opt.desc}</span>
              </button>
            ))}
          </div>
          {data.quality === 'needs-work' && (
            <p className="text-xs text-amber-400/80 mt-2">
              Consider investing in a professional shoot ($200-500 for 2-3 hours).
              No amount of design quality compensates for bad photography on a local business site.
            </p>
          )}
        </div>

        <div>
          <label className="input-label">Describe the standout images</label>
          <textarea
            value={data.proudOf}
            onChange={e => update('proudOf', e.target.value)}
            placeholder={"What images are you most proud of? What shows the quality of the work best?\n\ne.g., \"The kitchen remodel at 123 Oak — dramatic before/after. The team photo on the jobsite is the most authentic shot we have.\""}
            rows={3}
            className="input-field resize-none"
          />
        </div>
      </div>
    </div>
  )
}
