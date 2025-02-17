'use client'

import { IconCirclePlus, IconKey } from 'justd-icons'
import { useRouter } from 'next/navigation'
import React, { useTransition, type ReactNode } from 'react'
import { toast } from 'sonner'
import { Card } from '~/components/justd/ui'
import { PasskeyButton } from '~/feature/auth/components/passkey-button'
import { authClient } from '~/lib/auth/auth-client'

export function PasskeyCard({
  children,
  linkArea,
}: { children: ReactNode; linkArea: ReactNode }) {
  const router = useRouter()

  return (
    <Card className="mx-auto w-full max-w-md">
      {children}
      <Card.Content className="space-y-6 w-full">
        <PasskeyButton
          icon={<IconCirclePlus />}
          label="Add Passkey"
          onClick={async () => {
            const data = await authClient.passkey.addPasskey()

            if (data?.error) {
              toast.error('Failed to add passkey')

              return
            }

            toast.success('Passkey added successfully')

            router.push('/')
          }}
        />
      </Card.Content>
      <Card.Footer className="flex flex-col items-start gap-y-2 w-full">
        {linkArea}
      </Card.Footer>
    </Card>
  )
}
