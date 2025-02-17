import { twoFactorClient } from 'better-auth/plugins'
import { passkeyClient } from 'better-auth/plugins/passkey'
import { createAuthClient } from 'better-auth/react'
import { env } from '~/env'

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_APP_URL,
  plugins: [twoFactorClient(), passkeyClient()],
})
