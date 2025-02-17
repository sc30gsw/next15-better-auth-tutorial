import 'server-only'

import { eq } from 'drizzle-orm'
import { createMiddleware } from 'hono/factory'
import { db } from '~/lib/db/db'
import { users } from '~/lib/db/schema'

type AdditionalContext = Record<
  'Variables',
  {
    user: typeof users.$inferSelect
  }
>

export const sessionMiddleware = createMiddleware<AdditionalContext>(
  async (c, next) => {
    const userId = c.req.header('Authorization')

    if (!userId) {
      return c.json({ error: { message: 'Unauthorized' } }, 401)
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    })

    if (!user) {
      return c.json({ error: { message: 'User not found' } }, 404)
    }

    c.set('user', user)

    await next()
  },
)
