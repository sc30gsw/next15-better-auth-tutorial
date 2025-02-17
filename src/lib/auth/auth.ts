import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { nextCookies } from 'better-auth/next-js'
import { twoFactor } from 'better-auth/plugins'
import { passkey } from 'better-auth/plugins/passkey'
import { env } from '~/env'
import { sendTwoFactorTokenEmail } from '~/lib/auth/mail'
import { db } from '~/lib/db/db'
import * as schema from '~/lib/db/schema'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite',
    schema: schema,
    usePlural: true,
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },
  plugins: [
    twoFactor({
      otpOptions: {
        async sendOTP({ user, otp }) {
          await sendTwoFactorTokenEmail(user.email, otp)
        },
      },
    }),
    passkey(),
    nextCookies(),
  ],
})
