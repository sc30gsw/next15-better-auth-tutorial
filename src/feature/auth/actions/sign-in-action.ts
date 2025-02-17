'use server'

import { parseWithZod } from '@conform-to/zod'
import { APIError } from 'better-auth/api'
import { signInInputSchema } from '~/feature/auth/types/schemas/sign-in-input-schema'
import { auth } from '~/lib/auth/auth'

export const signInAction = async (_: unknown, formData: FormData) => {
  const submission = parseWithZod(formData, { schema: signInInputSchema })

  if (submission.status !== 'success') {
    return submission.reply()
  }

  try {
    await auth.api.signInEmail({
      body: {
        email: submission.value.email,
        password: submission.value.password,
      },
    })

    return submission.reply()
  } catch (err) {
    if (err instanceof APIError) {
      return submission.reply({
        fieldErrors: { message: [err.body.message ?? 'Something went wrong'] },
      })
    }

    return submission.reply({
      fieldErrors: { message: ['Something went wrong'] },
    })
  }
}
