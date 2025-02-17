import type { InferResponseType } from 'hono'
import { Suspense } from 'react'
import { Skeleton } from '~/components/justd/ui'
import { PassKeyModal } from '~/feature/auth/components/pass-key-modal'
import { SignOutButton } from '~/feature/auth/components/sign-out-button'
import { GET_PASS_KEY } from '~/feature/auth/constants/cache-kyes'

import { getServerSession } from '~/lib/auth/get-server-session'
import { fetcher } from '~/lib/fetcher'
import { client } from '~/lib/rpc'

async function getPassKey() {
  const session = await getServerSession()
  type ResType = InferResponseType<
    (typeof client.api)['pass-keys']['$get'],
    200
  >
  const url = client.api['pass-keys'].$url()
  const res = await fetcher<ResType>(url, {
    headers: {
      Authorization: session?.user?.id ?? '',
    },
    cache: 'force-cache',
    next: {
      tags: [GET_PASS_KEY],
    },
  })

  return res
}

export default async function Home() {
  const session = getServerSession()
  const passkeyPromise = getPassKey()

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-y-2">
      <div className="space-y-3 ">
        <Suspense fallback={<Skeleton className="h-6 w-72" />}>
          <p>{session.then((s) => s?.user.id)}</p>
        </Suspense>
        <Suspense fallback={<Skeleton className="h-6 w-72" />}>
          <p>{session.then((s) => s?.user.name)}</p>
        </Suspense>{' '}
      </div>

      <Suspense fallback={<Skeleton className="h-10 w-[146px]" />}>
        <div className="my-4">
          <PassKeyModal passKeyPromise={passkeyPromise} />
        </div>
      </Suspense>

      <SignOutButton />
    </div>
  )
}
