import Image from 'next/image'
import { getServerSession } from '~/lib/auth/get-server-session'

export default async function Home() {
  const session = await getServerSession()
  return <div>{session?.user.id}</div>
}
