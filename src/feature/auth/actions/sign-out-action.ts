'use server'

import { revalidateTag } from 'next/cache'

import {
  GET_PASS_KEY,
  GET_TWO_FACTOR,
  GET_USER_DETAILS,
} from '~/feature/auth/constants/cache-kyes'

export const signOutAction = async () => {
  revalidateTag(GET_TWO_FACTOR)
  revalidateTag(GET_PASS_KEY)
  revalidateTag(GET_USER_DETAILS)
}
