import { useState, useRef } from 'react'
import JSZip from 'jszip'

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg']

function isImage(filename) {
  const lower = filename.toLowerCase()
  return IMAGE_EXTENSIONS.some(ext => lower.endsWith(ext))
}

export default function ImageUploader({ images, onChange, showLabels = false, showFavorites = false, categories = [] }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef(null)

  const handleZipUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    setError('')

    try {
      const zip = new JSZip()
      const contents = await zip.loadAsync(file)
      const newImages = []

      for (const [path, zipEntry] of Object.entries(contents.files)) {
        if (zipEntry.dir) continue
        if (!isImage(path)) continue

        const blob = await zipEntry.async('blob')
        const url = URL.createObjectURL(blob)
        const name = path.split('/').pop()

        newImages.push({
          id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
          name,
          url,
          category: '',
          reason: '',
          description: '',
          isFavorite: false,
        })
      }

      if (newImages.length === 0) {
        setError('No images found in the zip file')
      } else {
        onChange([...images, ...newImages])
      }
    } catch (err) {
      setError('Failed to read zip file: ' + err.message)
    } finally {
      setLoading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const handleSingleUpload = async (e) => {
    const files = Array.from(e.target.files || [])
    const newImages = files.filter(f => isImage(f.name)).map(f => ({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name: f.name,
      url: URL.createObjectURL(f),
      category: '',
      reason: '',
      description: '',
      isFavorite: false,
    }))
    if (newImages.length > 0) {
      onChange([...images, ...newImages])
    }
  }

  const removeImage = (id) => {
    const img = images.find(i => i.id === id)
    if (img?.url?.startsWith('blob:')) URL.revokeObjectURL(img.url)
    onChange(images.filter(i => i.id !== id))
  }

  const updateImage = (id, field, value) => {
    onChange(images.map(i => i.id === id ? { ...i, [field]: value } : i))
  }

  return (
    <div>
      {/* Upload area */}
      <div className="flex gap-3 mb-4">
        <label className="btn-secondary cursor-pointer inline-flex items-center gap-2 text-sm">
          <span>{loading ? 'Extracting...' : 'Upload ZIP'}</span>
          <input
            ref={fileRef}
            type="file"
            accept=".zip"
            onChange={handleZipUpload}
            className="hidden"
            disabled={loading}
          />
        </label>
        <label className="btn-secondary cursor-pointer inline-flex items-center gap-2 text-sm">
          <span>Add Images</span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleSingleUpload}
            className="hidden"
          />
        </label>
      </div>

      {error && (
        <p className="text-sm text-red-400 mb-4">{error}</p>
      )}

      {/* Image grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {images.map(img => (
            <div key={img.id} className="group relative">
              <div className={`
                relative rounded-lg overflow-hidden border-2 transition-all
                ${img.isFavorite ? 'border-accent' : 'border-surface-4 hover:border-zinc-600'}
              `}>
                <img
                  src={img.url}
                  alt={img.name}
                  className="w-full h-36 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <button
                  onClick={() => removeImage(img.id)}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 text-zinc-300
                             hover:bg-red-500/80 hover:text-white flex items-center justify-center
                             text-xs opacity-0 group-hover:opacity-100 transition-all"
                >
                  &times;
                </button>
                {showFavorites && (
                  <button
                    onClick={() => updateImage(img.id, 'isFavorite', !img.isFavorite)}
                    className={`absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center
                               text-xs transition-all
                               ${img.isFavorite
                                 ? 'bg-accent text-surface-0'
                                 : 'bg-black/60 text-zinc-400 opacity-0 group-hover:opacity-100 hover:text-accent'
                               }`}
                    title="Mark as hero/feature candidate"
                  >
                    &#9733;
                  </button>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-xs text-zinc-200 truncate">{img.name}</p>
                </div>
              </div>

              {/* Labels */}
              {showLabels && (
                <div className="mt-2 space-y-1.5">
                  {categories.length > 0 && (
                    <select
                      value={img.category}
                      onChange={e => updateImage(img.id, 'category', e.target.value)}
                      className="w-full bg-surface-3 border border-surface-4 rounded text-xs px-2 py-1.5
                                 text-zinc-300 focus:outline-none focus:border-accent"
                    >
                      <option value="">Category...</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  )}
                  <input
                    type="text"
                    value={img.reason}
                    onChange={e => updateImage(img.id, 'reason', e.target.value)}
                    placeholder="Why this is here..."
                    className="w-full bg-surface-3 border border-surface-4 rounded text-xs px-2 py-1.5
                               text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-accent"
                  />
                </div>
              )}

              {showFavorites && !showLabels && (
                <input
                  type="text"
                  value={img.description || ''}
                  onChange={e => updateImage(img.id, 'description', e.target.value)}
                  placeholder="Describe this photo..."
                  className="w-full mt-2 bg-surface-3 border border-surface-4 rounded text-xs px-2 py-1.5
                             text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-accent"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="border-2 border-dashed border-surface-4 rounded-xl p-10 text-center">
          <p className="text-zinc-500 text-sm">Upload a .zip file or individual images</p>
          <p className="text-zinc-600 text-xs mt-1">Supports JPG, PNG, GIF, WebP, SVG</p>
        </div>
      )}
    </div>
  )
}
