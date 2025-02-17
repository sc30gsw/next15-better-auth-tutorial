'use client'

import { IconLogout } from 'justd-icons'
import { useRouter } from 'next/navigation'
import React, { useTransition } from 'react'
import { toast } from 'sonner'
import { Button, Loader } from '~/components/justd/ui'
import { signOutAction } from '~/feature/auth/actions/sign-out-action'
import { authClient } from '~/lib/auth/auth-client'

export function SignOutButton() {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  return (
    <Button
      className="w-40 my-2 relative"
      isDisabled={isPending}
      onPress={() =>
        startTransition(async () => {
          await signOutAction()

          await authClient.signOut({
            fetchOptions: {
              onSuccess: () => {
                toast.success('Signed out successfully')
                router.push('/sign-in')
              },
              onError: () => {
                toast.error('Failed to sign out')
                router.push('/')
              },
            },
          })
        })
      }
    >
      Sign Out
      {isPending ? (
        <Loader className="absolute top-3 right-2" />
      ) : (
        <IconLogout className="absolute top-2 right-2" />
      )}
    </Button>
  )
}
