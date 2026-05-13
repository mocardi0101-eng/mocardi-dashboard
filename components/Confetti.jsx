'use client'

import { useEffect, useState } from 'react'

const COLORS = ['#D4537E','#F4C0D1','#639922','#BA7517','#ED93B1','#FFD700','#FF6B6B']

export default function Confetti({ trigger }) {
  const [pieces, setPieces] = useState([])

  useEffect(() => {
    if (!trigger) return
    const newPieces = Array.from({ length: 28 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 0.4,
      size: 6 + Math.random() * 8,
      rotate: Math.random() * 360,
      shape: Math.random() > 0.5 ? 'circle' : 'square',
    }))
    setPieces(newPieces)
    const t = setTimeout(() => setPieces([]), 1200)
    return () => clearTimeout(t)
  }, [trigger])

  if (!pieces.length) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map(p => (
        <div
          key={p.id}
          className="confetti-piece absolute"
          style={{
            left: `${p.x}%`,
            top: 0,
            width:  p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : '2px',
            animationDelay: `${p.delay}s`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
    </div>
  )
}
