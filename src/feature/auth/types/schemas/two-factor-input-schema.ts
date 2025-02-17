import { z } from 'zod'

export const twoFactorInputSchema = z.object({
  password: z
    .string({ required_error: 'Password is required' })
    .min(8, { message: 'Password is too short' })
    .max(128, { message: 'Password is too long' }),
})

export type TwoFactorInputSchema = z.infer<typeof twoFactorInputSchema>
