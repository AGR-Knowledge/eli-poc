import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Clinical EDC - Eli Lilly PoC',
  description: 'Clinical Trial Electronic Data Capture System - Eli Lilly Proof of Concept',
  generator: 'Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
