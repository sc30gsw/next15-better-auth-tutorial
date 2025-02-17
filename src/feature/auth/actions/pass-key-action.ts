'use server'

import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { GET_PASS_KEY } from '~/feature/auth/constants/cache-kyes'

export const passKeyAction = async () => {
  revalidateTag(GET_PASS_KEY)

  redirect('/')
}
