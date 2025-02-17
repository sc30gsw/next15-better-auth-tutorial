'use server'

import { parseWithZod } from '@conform-to/zod'
import { APIError } from 'better-auth/api'
import { redirect } from 'next/navigation'
import { signInInputSchema } from '~/feature/auth/types/schemas/sign-in-input-schema'
import { auth } from '~/lib/auth/auth'
import { db } from '~/lib/db/db'

export const signInAction = async (_: unknown, formData: FormData) => {
  const submission = parseWithZod(formData, { schema: signInInputSchema })

  if (submission.status !== 'success') {
    return submission.reply()
  }

  try {
    const user = await db.query.users.findFirst({
      with: {
        twoFactors: true,
        accounts: true,
      },
      where: (users, { eq }) => eq(users.email, submission.value.email),
    })

    if (user?.accounts[0].providerId !== 'credential') {
      return submission.reply({
        fieldErrors: { message: ['Please sign in with Oauth'] },
      })
    }

    if (!user?.twoFactorEnabled || user.twoFactors.length === 0) {
      await auth.api.signInEmail({
        body: {
          email: submission.value.email,
          password: submission.value.password,
        },
      })

      redirect('/two-factor')
    }

    const res = await auth.api.signInEmail({
      body: {
        email: submission.value.email,
        password: submission.value.password,
        asResponse: true,
      },
    })

    if ('twoFactorRedirect' in res) {
      return submission.reply()
    }

    redirect('/two-factor')
  } catch (err) {
    if (err instanceof APIError) {
      return submission.reply({
        fieldErrors: { message: [err.body.message ?? 'Something went wrong'] },
      })
    }

    if (err instanceof Error) {
      if (err.message === 'NEXT_REDIRECT') {
        redirect('/two-factor')
      }
    }

    return submission.reply({
      fieldErrors: { message: ['Something went wrong'] },
    })
  }
}
