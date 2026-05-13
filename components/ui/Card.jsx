'use client'

export default function Card({ children, className = '', accent = '' }) {
  return (
    <div className={`bg-white rounded-3xl border border-pink-100 shadow-sm overflow-hidden card-lift ${className}`}>
      {accent && <div className={`h-1.5 w-full ${accent}`} />}
      <div className="p-5">
        {children}
      </div>
    </div>
  )
}
