import type { InferResponseType } from 'hono'
import React from 'react'
import { TwoFactorAlertDialog } from '~/feature/auth/components/tow-factor-alert-dialog'
import { GET_USER_DETAILS } from '~/feature/auth/constants/cache-kyes'
import { getServerSession } from '~/lib/auth/get-server-session'
import { fetcher } from '~/lib/fetcher'
import { client } from '~/lib/rpc'

async function getUserDetails() {
  const session = await getServerSession()

  type ResType = InferResponseType<typeof client.api.users.$get, 200>
  const url = client.api.users.$url()

  const res = await fetcher<ResType>(url, {
    headers: {
      Authorization: session?.user?.id ?? '',
    },
    cache: 'force-cache',
    next: {
      tags: [GET_USER_DETAILS],
    },
  })

  return res
}

export default async function TwoFactorAlertPage() {
  const res = await getUserDetails()

  const provider = res.user?.accounts[0].providerId
  const isEnabled = res.user?.twoFactorEnabled

  if (provider !== 'credential' && isEnabled) {
    return null
  }

  const isOpen = Boolean(!isEnabled && provider === 'credential')

  return <TwoFactorAlertDialog isOpen={isOpen} />
}
