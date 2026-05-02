import { useState, useCallback } from 'react'

const HERO_TYPES = [
  { id: 'split-immersive', label: 'Split Immersive', desc: 'Full-height, image 60%+ on one side, text on the other. Content sits in the image space.' },
  { id: 'full-bleed-cinematic', label: 'Full-Bleed Cinematic', desc: 'Full-viewport image/video with text overlaid, dark gradient, text positioned asymmetrically.' },
  { id: 'type-forward', label: 'Type Forward', desc: 'Massive headline dominates, minimal/no image, strong graphic element or texture in background.' },
  { id: 'layered-depth', label: 'Layered Depth', desc: 'Multiple visual planes — background image, foreground element, text between layers. Art-directed feel.' },
  { id: 'scroll-reveal', label: 'Scroll Reveal', desc: 'Starts minimal, builds as user scrolls. First viewport is sparse and intriguing. Bold and confident.' },
]

const SERVICE_DISPLAYS = [
  { id: 'scroll-showcase', label: 'Scroll-Triggered Showcase', desc: 'Each service gets a full moment — large image + text. Like flipping through a lookbook.' },
  { id: 'interactive-list', label: 'Interactive List', desc: 'Large bold text entries. Hover/tap reveals image or description. No cards, no boxes.' },
  { id: 'masonry-editorial', label: 'Masonry Editorial', desc: 'Asymmetric grid, different-sized images, text overlays. Nothing is the same size.' },
  { id: 'numbered-sequence', label: 'Numbered Sequence', desc: 'Large display numbers (01, 02...) with horizontal rules. Title + one line + bleed photo. Architectural.' },
  { id: 'accordion-expand', label: 'Accordion Expand', desc: 'Clean minimal list. Click to expand reveals rich content. Elegant closed, immersive open.' },
]

const GALLERY_DISPLAYS = [
  { id: 'full-bleed-scroll', label: 'Full-Bleed Scroll Gallery', desc: 'Full-width images stacked with overlap, interspersed with review quotes. Photo essay feel.' },
  { id: 'horizontal-scroll', label: 'Horizontal Scroll Strip', desc: 'Section scrolls horizontally. Large, cinematic crops. Unexpected and memorable.' },
  { id: 'before-after', label: 'Before/After Slider', desc: 'Interactive drag-to-compare. Proves competence instantly. (If applicable.)' },
  { id: 'curated-mosaic', label: 'Curated Mosaic', desc: '5-7 photos in intentional composition. Different sizes, some overlap, one anchor image.' },
]

const ABOUT_APPROACHES = [
  { id: 'bold-stat', label: 'Bold Stat + Photo', desc: 'A large claim or number ("400+ kitchens completed") with real founder/team photo.' },
  { id: 'narrative-split', label: 'Narrative Split', desc: 'Photo on one side, short personal story on the other. Written like a human, not a brochure.' },
  { id: 'timeline', label: 'Timeline / Milestones', desc: 'Key moments in the business history. Only if the history is genuinely impressive.' },
]

const MAP_STYLES = [
  { id: 'dark-mode', label: 'Dark Mode Map', desc: 'Custom dark-styled Google Map that matches the page' },
  { id: 'desaturated', label: 'Desaturated', desc: 'Muted colors, blends with the page rather than clashing' },
  { id: 'standard', label: 'Standard', desc: 'Default Google Maps embed' },
]

function SectionSelector({ label, options, value, onChange, notes, onNotesChange }) {
  return (
    <div className="mb-8">
      <label className="input-label">{label}</label>
      <div className="grid grid-cols-1 gap-2 mt-1">
        {options.map(opt => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`option-card ${value === opt.id ? 'selected' : ''}`}
          >
            <span className="text-sm font-semibold text-zinc-100">{opt.label}</span>
            <span className="block text-xs text-zinc-400 mt-1">{opt.desc}</span>
          </button>
        ))}
      </div>
      {onNotesChange && (
        <textarea
          value={notes || ''}
          onChange={e => onNotesChange(e.target.value)}
          placeholder="Additional notes or ideas for this section..."
          rows={2}
          className="input-field mt-2 resize-none text-sm"
        />
      )}
    </div>
  )
}

function SectionPriority({ sections, onChange }) {
  const [dragging, setDragging] = useState(null)

  const moveUp = (index) => {
    if (index === 0) return
    const newSections = [...sections]
    ;[newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]]
    onChange(newSections)
  }

  const moveDown = (index) => {
    if (index === sections.length - 1) return
    const newSections = [...sections]
    ;[newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]]
    onChange(newSections)
  }

  const labels = {
    hero: 'Hero',
    trust: 'Trust Strip',
    services: 'Services',
    proof: 'Work / Gallery',
    reviews: 'Reviews',
    about: 'About / Why Us',
    map: 'Service Area + Map',
    contact: 'Contact / CTA',
  }

  return (
    <div className="mb-8">
      <label className="input-label">Section Priority (top = most visual weight)</label>
      <p className="input-hint mb-3">Reorder to tell me what matters most. Hero always stays first.</p>
      <div className="space-y-1">
        {sections.map((section, i) => (
          <div
            key={section}
            className="flex items-center gap-2 bg-surface-2 border border-surface-4 rounded-lg px-3 py-2"
          >
            <span className="text-xs font-mono text-zinc-600 w-5">{i + 1}.</span>
            <span className="text-sm text-zinc-200 flex-1">{labels[section] || section}</span>
            <div className="flex gap-1">
              <button
                onClick={() => moveUp(i)}
                disabled={i === 0}
                className="w-6 h-6 rounded text-xs text-zinc-500 hover:text-zinc-300
                           hover:bg-surface-4 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
              >
                ↑
              </button>
              <button
                onClick={() => moveDown(i)}
                disabled={i === sections.length - 1}
                className="w-6 h-6 rounded text-xs text-zinc-500 hover:text-zinc-300
                           hover:bg-surface-4 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
              >
                ↓
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Step8Homepage({ brief, updateBrief }) {
  const data = brief.homepage
  const update = (field, value) => {
    updateBrief('homepage', { ...data, [field]: value })
  }

  return (
    <div>
      <h2 className="section-title">Homepage Sections</h2>
      <p className="section-desc">
        Pick how each section should work. No basic card grids. No generic animations.
        Each choice here is an alternative to the template default.
      </p>

      <SectionSelector
        label="Hero Type"
        options={HERO_TYPES}
        value={data.heroType}
        onChange={v => update('heroType', v)}
        notes={data.heroNotes}
        onNotesChange={v => update('heroNotes', v)}
      />

      <SectionSelector
        label="Services Display (NOT a card grid)"
        options={SERVICE_DISPLAYS}
        value={data.servicesDisplay}
        onChange={v => update('servicesDisplay', v)}
        notes={data.servicesNotes}
        onNotesChange={v => update('servicesNotes', v)}
      />

      <SectionSelector
        label="Work / Gallery Display"
        options={GALLERY_DISPLAYS}
        value={data.galleryDisplay}
        onChange={v => update('galleryDisplay', v)}
        notes={data.galleryNotes}
        onNotesChange={v => update('galleryNotes', v)}
      />

      <SectionSelector
        label="About / Why Us Approach"
        options={ABOUT_APPROACHES}
        value={data.aboutApproach}
        onChange={v => update('aboutApproach', v)}
        notes={data.aboutNotes}
        onNotesChange={v => update('aboutNotes', v)}
      />

      <SectionSelector
        label="Map Style"
        options={MAP_STYLES}
        value={data.mapStyle}
        onChange={v => update('mapStyle', v)}
      />

      {/* Contact */}
      <div className="mb-8">
        <label className="input-label">Contact Form</label>
        <p className="input-hint mb-2">
          Short form converts best. Name + phone + message is the default.
          Add notes if you want anything adjusted.
        </p>
        <div className="flex flex-wrap gap-2 mb-2">
          {[
            { id: 'name-phone-message', label: 'Name + Phone + Message' },
            { id: 'name-email-phone-message', label: '+ Email' },
            { id: 'name-phone-service-message', label: '+ Service Type' },
          ].map(opt => (
            <button
              key={opt.id}
              type="button"
              onClick={() => update('contactFields', opt.id)}
              className={`tag cursor-pointer transition-all ${data.contactFields === opt.id ? 'border-accent text-accent' : 'hover:border-zinc-500'}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <textarea
          value={data.contactNotes || ''}
          onChange={e => update('contactNotes', e.target.value)}
          placeholder="Any notes about the contact section..."
          rows={2}
          className="input-field resize-none text-sm"
        />
      </div>

      <SectionPriority
        sections={data.sectionPriority}
        onChange={v => update('sectionPriority', v)}
      />
    </div>
  )
}
