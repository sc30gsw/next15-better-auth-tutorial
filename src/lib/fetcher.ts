import { notFound, redirect } from 'next/navigation'
import 'server-only'

type FetchArgs = Parameters<typeof fetch>

export const fetcher = async <T>(url: FetchArgs[0], args?: FetchArgs[1]) => {
  const res = await fetch(url, args)

  switch (res.status) {
    case 404:
      notFound()
      break

    case 401:
      redirect('/sign-in')
      break

    default:
      break
  }

  const json: T = await res.json()

  return json
}
