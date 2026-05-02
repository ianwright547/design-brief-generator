export default function SliderInput({ leftLabel, rightLabel, value, onChange }) {
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs font-medium transition-colors ${value < 40 ? 'text-accent' : 'text-zinc-500'}`}>
          {leftLabel}
        </span>
        <span className={`text-xs font-medium transition-colors ${value > 60 ? 'text-accent' : 'text-zinc-500'}`}>
          {rightLabel}
        </span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={e => onChange(parseInt(e.target.value))}
        className="w-full"
      />
    </div>
  )
}
