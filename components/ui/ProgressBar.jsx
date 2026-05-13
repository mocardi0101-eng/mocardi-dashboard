'use client'

export default function ProgressBar({ value, max, colorClass = '' }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))

  let color = colorClass
  if (!colorClass) {
    if (pct >= 90) color = 'bg-brand-red'
    else if (pct >= 70) color = 'bg-brand-amber'
    else color = 'bg-brand-green'
  }

  return (
    <div className="w-full bg-pink-100 rounded-full h-2.5 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
