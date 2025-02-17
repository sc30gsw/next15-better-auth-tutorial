import type { InferResponseType } from 'hono'
import React from 'react'
import { Card } from '~/components/justd/ui'
import { TwoFactorForm } from '~/feature/auth/components/two-factor-form'
import { getServerSession } from '~/lib/auth/get-server-session'
import { fetcher } from '~/lib/fetcher'
import { client } from '~/lib/rpc'

export default async function TwoFactorPage() {
  const session = await getServerSession()

  type ResType = InferResponseType<
    (typeof client.api)['two-factors']['$get'],
    200
  >
  const url = client.api['two-factors'].$url()

  const res = await fetcher<ResType>(url, {
    headers: {
      Authorization: session?.user?.id ?? '',
    },
    cache: 'no-store',
  })

  if (res.twoFactor) {
    // TODO: OTP入力フォームの作成
    return <div>hoge</div>
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
