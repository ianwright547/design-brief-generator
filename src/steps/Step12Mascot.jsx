import ImageUploader from '../components/ImageUploader'

const MASCOT_STYLES = [
  {
    id: 'flat-vector',
    label: 'Flat Vector',
    desc: 'Simple, clean 2D vector style with flat colors. Bold shapes, no shading. Strong silhouettes.',
  },
  {
    id: 'shaded-2d',
    label: 'Shaded 2D',
    desc: 'Flat 2D with subtle gradients for depth. Still clearly illustrated, not realistic.',
  },
  {
    id: 'geometric',
    label: 'Geometric / Abstract',
    desc: 'Built from basic shapes — circles, triangles, rectangles. Clean, modern, iconic feel.',
  },
  {
    id: 'mascot-logo',
    label: 'Mascot Logo / Badge',
    desc: 'Bold badge-style character designed to work as a logo mark. Strong silhouette, no facial detail.',
  },
  {
    id: 'line-art',
    label: 'Line Art / Outline',
    desc: 'Clean single-weight line drawing, minimal or no fill. Modern and minimal.',
  },
  {
    id: 'silhouette',
    label: 'Silhouette / Shadow',
    desc: 'Solid filled shape with no internal detail. Recognizable by outline alone. Very versatile.',
  },
]

const CHARACTER_TYPES = [
  { id: 'owner-figure', label: 'Owner / Founder', desc: 'Faceless 2D figure of the business owner — personality through build, outfit, pose, and accessories' },
  { id: 'team-figures', label: 'Team Members', desc: 'Multiple faceless figures representing the crew — differentiated by uniforms, tools, body types' },
  { id: 'worker-figure', label: 'Worker / Tradesperson', desc: 'Generic faceless worker in the trade — hard hat, tool belt, uniform. Represents the profession' },
  { id: 'animal-mascot', label: 'Animal Mascot', desc: 'A stylized animal representing the brand — no detailed face, personality through body language' },
  { id: 'object-mascot', label: 'Object / Tool Mascot', desc: 'A tool or object brought to life (wrench, house, tooth, etc.) — no face, personality through shape and pose' },
  { id: 'symbol-character', label: 'Symbol / Icon', desc: 'A brand symbol with character energy — shield, flame, gear, etc. Personality through motion and context' },
]

const POSES = [
  { id: 'standing-strong', label: 'Standing / Strong', desc: 'Upright, confident body posture — conveys reliability' },
  { id: 'in-action', label: 'In Action', desc: 'Actively doing the work — holding tools, building, moving' },
  { id: 'dynamic-motion', label: 'Dynamic / Motion', desc: 'Leaping, running, or in mid-action — conveys energy' },
  { id: 'presenting', label: 'Presenting / Directing', desc: 'Gesturing toward content, guiding the viewer\'s eye' },
  { id: 'resting-calm', label: 'Resting / Calm', desc: 'Relaxed posture, leaning — conveys trust and ease' },
  { id: 'multiple-poses', label: 'Multiple Poses', desc: 'Several variations of the same character for different sections' },
]

const USE_CASES = [
  { id: 'hero-feature', label: 'Hero / Feature Image', desc: 'Large, prominent placement in the hero section' },
  { id: 'section-accent', label: 'Section Accents', desc: 'Smaller characters placed throughout sections as visual interest' },
  { id: 'about-page', label: 'About Page Identity', desc: 'Character represents the owner on the about section' },
  { id: 'faq-guide', label: 'FAQ / Guide', desc: 'Character appears alongside FAQ or how-it-works sections' },
  { id: 'logo-integration', label: 'Logo Integration', desc: 'Character designed to work as part of or alongside the logo' },
  { id: 'all-around', label: 'All-Around Use', desc: 'Versatile character for use across multiple sections and pages' },
]

export default function Step12Mascot({ brief, updateBrief }) {
  const data = brief.mascot || {}
  const update = (field, value) => {
    updateBrief('mascot', { ...data, [field]: value })
  }

  return (
    <div>
      <h2 className="section-title">Mascot / Character</h2>
      <p className="section-desc">
        Want a custom 2D character or mascot for the site? These give local businesses
        instant personality — uniquely theirs, not stock photography. All characters are
        halal-compliant: 2D flat illustration only, no facial features, personality
        conveyed through shape, pose, and body language.
      </p>

      {/* Want mascot? */}
      <div className="mb-8">
        <label className="input-label">Does this client need a mascot or character?</label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'yes', label: 'Yes', desc: 'Custom character needed' },
            { id: 'maybe', label: 'Maybe', desc: 'Open to it, want to explore' },
            { id: 'no', label: 'No', desc: 'Not for this project' },
          ].map(opt => (
            <button
              key={opt.id}
              type="button"
              onClick={() => update('wantsMascot', opt.id)}
              className={`option-card ${data.wantsMascot === opt.id ? 'selected' : ''}`}
            >
              <span className="text-sm font-medium text-zinc-200">{opt.label}</span>
              <span className="block text-xs text-zinc-500 mt-0.5">{opt.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {(data.wantsMascot === 'yes' || data.wantsMascot === 'maybe') && (
        <div className="space-y-8">
          {/* Style */}
          <div>
            <label className="input-label">Illustration Style</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MASCOT_STYLES.map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => update('style', s.id)}
                  className={`option-card ${data.style === s.id ? 'selected' : ''}`}
                >
                  <span className="text-sm font-semibold text-zinc-100">{s.label}</span>
                  <span className="block text-xs text-zinc-400 mt-1">{s.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Character type */}
          <div>
            <label className="input-label">Character Type</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CHARACTER_TYPES.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => update('character', c.id)}
                  className={`option-card ${data.character === c.id ? 'selected' : ''}`}
                >
                  <span className="text-sm font-semibold text-zinc-100">{c.label}</span>
                  <span className="block text-xs text-zinc-400 mt-1">{c.desc}</span>
                </button>
              ))}
            </div>

            {(data.character === 'owner-figure' || data.character === 'team-figures') && (
              <div className="card mt-3">
                <p className="text-xs text-zinc-400">
                  Upload a reference photo below for body type, build, and typical work outfit.
                  The character will be faceless — personality comes from posture, clothing, accessories, and proportions.
                </p>
              </div>
            )}

            {data.character === 'animal-mascot' && (
              <div className="mt-3">
                <label className="input-label">Which animal?</label>
                <input
                  type="text"
                  value={data.animalType || ''}
                  onChange={e => update('animalType', e.target.value)}
                  placeholder={"e.g., Gorilla, Bulldog, Eagle, Bear, Lion — or describe the vibe: \"something strong and protective\""}
                  className="input-field"
                />
              </div>
            )}
          </div>

          {/* Pose */}
          <div>
            <label className="input-label">Pose / Stance</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {POSES.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => update('pose', p.id)}
                  className={`option-card ${data.pose === p.id ? 'selected' : ''}`}
                >
                  <span className="text-sm font-medium text-zinc-200">{p.label}</span>
                  <span className="block text-[10px] text-zinc-500 mt-0.5">{p.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Energy / Vibe */}
          <div>
            <label className="input-label">Character Energy</label>
            <p className="input-hint mb-2">What vibe should the character give off through body language and context?</p>
            <div className="flex flex-wrap gap-2">
              {['Powerful', 'Dependable', 'Energetic', 'Friendly', 'Professional', 'Bold', 'Calm/Trusted', 'Playful'].map(exp => (
                <button
                  key={exp}
                  type="button"
                  onClick={() => update('expression', exp)}
                  className={`tag cursor-pointer transition-all ${data.expression === exp ? 'border-accent text-accent' : 'hover:border-zinc-500'}`}
                >
                  {exp}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div>
            <label className="input-label">Character Colors</label>
            <input
              type="text"
              value={data.colors || ''}
              onChange={e => update('colors', e.target.value)}
              placeholder={"Match brand colors? Specific outfit colors? e.g., \"Company shirt is red, hard hat yellow\" or \"Use brand orange #E87C3E\""}
              className="input-field"
            />
            <p className="input-hint">
              Should the character wear brand colors? What color is their uniform/outfit?
            </p>
          </div>

          {/* Use case */}
          <div>
            <label className="input-label">Where will this character be used?</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {USE_CASES.map(u => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => update('useCase', u.id)}
                  className={`option-card ${data.useCase === u.id ? 'selected' : ''}`}
                >
                  <span className="text-sm font-medium text-zinc-200">{u.label}</span>
                  <span className="block text-[10px] text-zinc-500 mt-0.5">{u.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Reference images */}
          <div>
            <label className="input-label">Reference Images</label>
            <p className="input-hint mb-3">
              Upload examples of mascot styles you like, photos of the owner (for portrait characters),
              or any visual references for the character design.
            </p>
            <ImageUploader
              images={data.referenceImages || []}
              onChange={(images) => update('referenceImages', images)}
              showLabels={true}
              categories={['Style reference', 'Body/outfit reference', 'Competitor mascot', 'Color reference', 'Pose reference', 'Other']}
            />
          </div>

          {/* Additional notes */}
          <div>
            <label className="input-label">Additional Notes</label>
            <textarea
              value={data.notes || ''}
              onChange={e => update('notes', e.target.value)}
              placeholder={"Anything else about the character — specific accessories (tool belt, hard hat, stethoscope), body proportions, silhouette shape, or brand story context.\n\nRemember: no facial features. Personality comes from shape, pose, accessories, and color."}
              rows={4}
              className="input-field resize-none"
            />
          </div>
        </div>
      )}
    </div>
  )
}
