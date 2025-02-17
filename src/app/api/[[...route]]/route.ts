import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import twoFactors from '~/feature/auth/api/route'

export const runtime = 'edge'

const app = new Hono().basePath('/api')

const routes = app.route('/two-factors', twoFactors)

export const GET = handle(app)
export const POST = handle(app)

export type AppType = typeof routes
