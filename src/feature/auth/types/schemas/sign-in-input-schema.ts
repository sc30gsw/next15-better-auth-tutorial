import { z } from 'zod'

export const signInInputSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email()
    .max(128, { message: 'Email is too long' }),
  password: z
    .string({ required_error: 'Password is required' })
    .min(8, { message: 'Password is too short' })
    .max(128, { message: 'Password is too long' }),
})

export type SignInInputSchema = z.infer<typeof signInInputSchema>
