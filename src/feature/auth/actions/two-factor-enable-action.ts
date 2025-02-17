'use server'

import { parseWithZod } from '@conform-to/zod'
import { twoFactorInputSchema } from '~/feature/auth/types/schemas/two-factor-input-schema'
import { authClient } from '~/lib/auth/auth-client'

export const twoFactorEnableAction = async (_: unknown, formData: FormData) => {
  const submission = parseWithZod(formData, { schema: twoFactorInputSchema })

  if (submission.status !== 'success') {
    return submission.reply()
  }

  return submission.reply()
}
