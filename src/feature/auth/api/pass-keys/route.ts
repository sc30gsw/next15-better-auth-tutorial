import { Hono } from 'hono'
import { sessionMiddleware } from '~/lib/auth/session-middleware'
import { db } from '~/lib/db/db'

const app = new Hono().get('/', sessionMiddleware, async (c) => {
  const user = c.get('user')

  const passKey = await db.query.passkeys.findFirst({
    where: (passkey, { eq }) => eq(passkey.userId, user.id),
  })

  return c.json({ passKey }, 200)
})

export default app
