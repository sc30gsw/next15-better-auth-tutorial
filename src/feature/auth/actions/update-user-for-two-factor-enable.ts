'use server'

import { eq } from 'drizzle-orm'
import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import {
  GET_TWO_FACTOR,
  GET_USER_DETAILS,
} from '~/feature/auth/constants/cache-kyes'
import { getServerSession } from '~/lib/auth/get-server-session'
import { db } from '~/lib/db/db'
import { users } from '~/lib/db/schema'

export const updateUserForTwoFactorEnable = async () => {
  try {
    const session = await getServerSession()

    if (!session) {
      redirect('/sign-in')
    }

    await db
      .update(users)
      .set({ twoFactorEnabled: true })
      .where(eq(users.id, session.user.id))

    revalidateTag(GET_TWO_FACTOR)
    revalidateTag(GET_USER_DETAILS)

    return { isSuccess: true }
  } catch (err) {
    return { isSuccess: false }
  }
}
