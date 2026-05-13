import './globals.css'

export const metadata = {
  title: 'Mocardi Dashboard 🍰',
  description: 'Internal Operational Dashboard — Delight in every bite',
  icons: { icon: '/logo.jpg' },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}
