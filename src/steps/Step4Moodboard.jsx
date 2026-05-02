import ImageUploader from '../components/ImageUploader'

const CATEGORIES = [
  'Website',
  'Editorial / Print',
  'Photography style',
  'Texture / Material',
  'Color in context',
  'Brand / Packaging',
  'Typography in use',
  'Signage / Physical',
  'Interior / Space',
  'Other',
]

export default function Step4Moodboard({ brief, updateBrief }) {
  const data = brief.moodboard

  return (
    <div>
      <h2 className="section-title">Moodboard</h2>
      <p className="section-desc">
        Upload a .zip of your curated references. Label each image with a category and one sentence explaining
        why it's here. At least half should come from the physical world — interiors, signage, print, materials.
      </p>

      <div className="card mb-6">
        <h3 className="text-sm font-semibold text-zinc-300 mb-3">What makes a moodboard useful</h3>
        <ul className="text-xs text-zinc-500 space-y-1.5">
          <li>
            <span className="text-accent mr-1.5">+</span>
            6-15 curated images that feel like they belong together
          </li>
          <li>
            <span className="text-accent mr-1.5">+</span>
            Each labeled with why: "I like how this uses oversized serif type against a minimal grid"
          </li>
          <li>
            <span className="text-accent mr-1.5">+</span>
            Mix of digital and physical — websites, interiors, signage, print
          </li>
          <li>
            <span className="text-red-400 mr-1.5">&times;</span>
            NOT random screenshots you "liked" with no explanation
          </li>
          <li>
            <span className="text-red-400 mr-1.5">&times;</span>
            NOT all from the same industry — force diversity
          </li>
        </ul>
      </div>

      <ImageUploader
        images={data.images}
        onChange={(images) => updateBrief('moodboard', { images })}
        showLabels={true}
        categories={CATEGORIES}
      />

      {data.images.length > 0 && data.images.length < 6 && (
        <p className="text-xs text-amber-400/80 mt-4">
          You have {data.images.length} images. Aim for at least 6 for a useful moodboard.
        </p>
      )}
    </div>
  )
}
