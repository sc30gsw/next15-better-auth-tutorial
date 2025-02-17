'use client'

import { IconLogout } from 'justd-icons'
import React from 'react'
import { Button } from '~/components/justd/ui'
import { signOutAction } from '~/feature/auth/actions/sign-out-action'

export function SignOutButton() {
  return (
    <Button onPress={async () => await signOutAction()}>
      Sign Out
      <IconLogout />
    </Button>
  )
}
