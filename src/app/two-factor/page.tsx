import type { InferResponseType } from 'hono'
import type { SearchParams } from 'nuqs'
import React from 'react'
import { Card } from '~/components/justd/ui'
import { OtpForm } from '~/feature/auth/components/otp-form'
import { PassKeyContainer } from '~/feature/auth/components/pass-key-container'

import { TwoFactorForm } from '~/feature/auth/components/two-factor-form'
import { GET_TWO_FACTOR } from '~/feature/auth/constants/cache-kyes'
import { loadPassKeySearchParams } from '~/feature/auth/types/search-params/pass-key-search-params'

import { getServerSession } from '~/lib/auth/get-server-session'
import { fetcher } from '~/lib/fetcher'
import { client } from '~/lib/rpc'

async function getTwoFactor(currentUserId: string) {
  type ResType = InferResponseType<
    (typeof client.api)['two-factors']['$get'],
    200
  >
  const url = client.api['two-factors'].$url()

  const res = await fetcher<ResType>(url, {
    headers: {
      Authorization: currentUserId,
    },
    cache: 'force-cache',
    next: {
      tags: [GET_TWO_FACTOR],
    },
  })

  return res
}

export default async function TwoFactorPage({
  searchParams,
}: { searchParams: Promise<SearchParams> }) {
  const { isPassKey } = await loadPassKeySearchParams(searchParams)

  if (isPassKey) {
    return <PassKeyContainer />
  }

  const session = await getServerSession()

  if (!session) {
    return <OtpForm />
  }

  const res = await getTwoFactor(session.user.id)

  if (res.twoFactor) {
    return <OtpForm />
  }

  return (
    <TwoFactorForm>
      <Card.Header>
        <Card.Title>Two Factor</Card.Title>
        <Card.Description>
          Input your password and two factor code
        </Card.Description>
      </Card.Header>
    </TwoFactorForm>
  )
}
