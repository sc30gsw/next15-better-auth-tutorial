import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import passKeys from '~/feature/auth/api/pass-keys/route'
import twoFactors from '~/feature/auth/api/two-factors/route'
import users from '~/feature/auth/api/users/route'

export const runtime = 'edge'

const app = new Hono().basePath('/api')

const routes = app
  .route('/two-factors', twoFactors)
  .route('/pass-keys', passKeys)
  .route('/users', users)

export const GET = handle(app)
export const POST = handle(app)

export type AppType = typeof routes
