import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from './components'

import "react-responsive-modal/styles.css"
import "@/app/globals.css"

export const metadata: Metadata = {
  title: "ComHub",
  description: "ComHub - the hub for Commune Ai modules.",
  robots: 'all',
  icons: [{ rel: 'icon', url: '/favicon.ico' }]
}

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} h-full relative bg-gray-900`}>
          <Header />
          {children}
      </body>
    </html>
  )
}