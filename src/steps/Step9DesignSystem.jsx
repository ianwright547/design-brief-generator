function ChoiceRow({ label, options, value, onChange }) {
  return (
    <div className="mb-5">
      <label className="input-label">{label}</label>
      <div className="flex gap-2 mt-1">
        {options.map(opt => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`flex-1 option-card text-center ${value === opt.id ? 'selected' : ''}`}
          >
            <span className="text-sm font-medium text-zinc-200">{opt.label}</span>
            {opt.visual && (
              <div className="mt-2 flex justify-center">{opt.visual}</div>
            )}
            <span className="block text-[10px] text-zinc-500 mt-1">{opt.desc}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default function Step9DesignSystem({ brief, updateBrief }) {
  const data = brief.designSystem
  const update = (field, value) => {
    updateBrief('designSystem', { ...data, [field]: value })
  }

  return (
    <div>
      <h2 className="section-title">Design System</h2>
      <p className="section-desc">
        6 decisions that take 2 minutes. They'll influence every pixel. This is what separates
        agency work from template work — systematic consistency.
      </p>

      <ChoiceRow
        label="Spacing"
        value={data.spacing}
        onChange={v => update('spacing', v)}
        options={[
          { id: 'tight', label: 'Tight', desc: 'Dense, information-rich' },
          { id: 'medium', label: 'Medium', desc: 'Balanced, comfortable' },
          { id: 'generous', label: 'Generous', desc: 'Airy, lots of breathing room' },
        ]}
      />

      <ChoiceRow
        label="Corner Radius"
        value={data.corners}
        onChange={v => update('corners', v)}
        options={[
          {
            id: 'sharp',
            label: 'Sharp',
            desc: 'Premium, editorial',
            visual: <div className="w-10 h-7 border-2 border-zinc-500 rounded-none" />,
          },
          {
            id: 'moderate',
            label: 'Moderate',
            desc: 'Balanced, professional',
            visual: <div className="w-10 h-7 border-2 border-zinc-500 rounded-md" />,
          },
          {
            id: 'rounded',
            label: 'Rounded',
            desc: 'Soft, approachable',
            visual: <div className="w-10 h-7 border-2 border-zinc-500 rounded-xl" />,
          },
          {
            id: 'pill',
            label: 'Pill',
            desc: 'Playful, modern',
            visual: <div className="w-10 h-7 border-2 border-zinc-500 rounded-full" />,
          },
        ]}
      />

      <ChoiceRow
        label="Shadows"
        value={data.shadows}
        onChange={v => update('shadows', v)}
        options={[
          {
            id: 'none',
            label: 'None',
            desc: 'Flat — borders and color for depth',
            visual: <div className="w-10 h-7 bg-surface-4 rounded-md border border-zinc-600" />,
          },
          {
            id: 'subtle',
            label: 'Subtle',
            desc: 'Soft layering',
            visual: <div className="w-10 h-7 bg-surface-3 rounded-md shadow-md shadow-black/30" />,
          },
          {
            id: 'noticeable',
            label: 'Noticeable',
            desc: 'Clear depth hierarchy',
            visual: <div className="w-10 h-7 bg-surface-3 rounded-md shadow-xl shadow-black/40" />,
          },
        ]}
      />

      <ChoiceRow
        label="Photography Treatment"
        value={data.photoStyle}
        onChange={v => update('photoStyle', v)}
        options={[
          { id: 'full-color', label: 'Full Color', desc: 'Natural, vibrant' },
          { id: 'muted', label: 'Muted', desc: 'Desaturated, sophisticated' },
          { id: 'bw', label: 'B&W', desc: 'High contrast, dramatic' },
        ]}
      />

      <ChoiceRow
        label="Accent Color Usage"
        value={data.accentUsage}
        onChange={v => update('accentUsage', v)}
        options={[
          { id: 'sparing', label: 'Sparing', desc: 'One color, used rarely for emphasis' },
          { id: 'moderate', label: 'Moderate', desc: 'Present but restrained' },
          { id: 'bold', label: 'Bold', desc: 'Strong color presence throughout' },
        ]}
      />
    </div>
  )
}
