'use server'

import { parseWithZod } from '@conform-to/zod'
import { APIError } from 'better-auth/api'
import { signUpInputSchema } from '~/feature/auth/types/schemas/sign-up-input-schema'
import { auth } from '~/lib/auth/auth'
import { db } from '~/lib/db/db'

export const signUpAction = async (_: unknown, formData: FormData) => {
  const submission = parseWithZod(formData, { schema: signUpInputSchema })

  if (submission.status !== 'success') {
    return submission.reply()
  }

  try {
    const existingUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, submission.value.email),
    })

    if (existingUser) {
      return submission.reply({
        fieldErrors: { message: ['Email or Name already in use'] },
      })
    }

    await auth.api.signUpEmail({
      body: {
        name: submission.value.name,
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
