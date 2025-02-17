import Image from 'next/image'
import { Button } from '~/components/justd/ui'
import { SignOutButton } from '~/feature/auth/compoennts/sign-out-button'
import { getServerSession } from '~/lib/auth/get-server-session'

export default async function Home() {
  const session = await getServerSession()
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-y-2">
      {session?.user.id}
      <br />
      {session?.user.name}
      <SignOutButton />
    </div>
  )
}
