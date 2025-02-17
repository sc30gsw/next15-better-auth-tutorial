import { z } from 'zod'

export const signUpInputSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email()
    .max(128, { message: 'Email is too long' }),
  password: z
    .string({ required_error: 'Password is required' })
    .min(8, { message: 'Password is too short' })
    .max(128, { message: 'Password is too long' }),
  name: z
    .string({ required_error: 'Name is required' })
    .max(128, { message: 'Name is too long' }),
})

export type SignUpInputSchema = z.infer<typeof signUpInputSchema>
