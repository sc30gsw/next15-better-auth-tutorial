import { Hono } from 'hono'
import { sessionMiddleware } from '~/lib/auth/session-middleware'
import { db } from '~/lib/db/db'

const app = new Hono().get('/', sessionMiddleware, async (c) => {
  const currentUser = c.get('user')

  const user = await db.query.users.findFirst({
    with: {
      accounts: true,
    },
    where: (users, { eq }) => eq(users.id, currentUser.id),
  })

  return c.json({ user }, 200)
})

export default app
