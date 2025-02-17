import { Hono } from 'hono'
import { sessionMiddleware } from '~/lib/auth/session-middleware'
import { db } from '~/lib/db/db'

const app = new Hono().get('/', sessionMiddleware, async (c) => {
  const user = c.get('user')

  const twoFactor = await db.query.twoFactors.findFirst({
    where: (twoFactors, { eq }) => eq(twoFactors.userId, user.id),
  })

  return c.json({ twoFactor }, 200)
})

export default app
