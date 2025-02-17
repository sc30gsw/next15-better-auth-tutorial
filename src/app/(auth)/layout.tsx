import { redirect } from 'next/navigation'
import React, { type ReactNode } from 'react'
import { getServerSession } from '~/lib/auth/get-server-session'

export default async function AuthLayout({
  children,
}: { children: ReactNode }) {
  const session = await getServerSession()

  if (session) {
    redirect('/')
  }

  return (
    <div className="flex items-center justify-center h-dvh">{children}</div>
  )
}
