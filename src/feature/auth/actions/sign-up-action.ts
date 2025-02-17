'use server'

import { parseWithZod } from '@conform-to/zod'
import bcrypt from 'bcryptjs'
import { signUpInputSchema } from '~/feature/auth/types/schemas/sign-up-input-schema'
import { auth } from '~/lib/auth/auth'
import { db } from '~/lib/db/db'
import { users } from '~/lib/db/schema'

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

    const hashedPassword = await bcrypt.hash(submission.value.password, 10)

    await auth.api.signUpEmail({
      body: {
        name: submission.value.name,
        email: submission.value.email,
        password: hashedPassword,
      },
    })

    return submission.reply()
  } catch (err) {
    return submission.reply({
      fieldErrors: { message: ['Something went wrong'] },
    })
  }
}
