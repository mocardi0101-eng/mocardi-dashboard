'use client'

const variants = {
  success: 'bg-green-100 text-green-800 border-green-200',
  warning: 'bg-amber-100 text-amber-800 border-amber-200',
  danger:  'bg-red-100 text-red-700 border-red-200',
  default: 'bg-pink-50 text-pink-600 border-pink-200',
  gray:    'bg-gray-100 text-gray-600 border-gray-200',
}

export default function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
