import React, { type ReactNode } from 'react'

export default function TwoFactorLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-center h-dvh">{children}</div>
  )
}
