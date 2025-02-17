import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import type { ReactNode } from 'react'
import { Providers } from '~/components/justd/providers'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Better Auth Tutorial',
  description: 'A tutorial on how to build a better auth',
}

export default function RootLayout({
  children,
  alert,
}: Readonly<{
  children: ReactNode
  alert: ReactNode
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <main className="min-h-dvh min-w-fit max-w-svw">{children}</main>
          {alert}
        </Providers>
      </body>
    </html>
  )
}
