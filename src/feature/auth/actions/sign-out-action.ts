'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '~/lib/auth/auth'

export const signOutAction = async () => {
  const result = await auth.api.signOut({ headers: await headers() })

  if (!result.success) {
    redirect('/')
  }

  redirect('/sign-in')
}
