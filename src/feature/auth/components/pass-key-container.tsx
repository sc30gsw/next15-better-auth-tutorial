import Link from 'next/link'
import React from 'react'
import { Card } from '~/components/justd/ui'
import { PasskeyCard } from '~/feature/auth/components/passkey-card'

export function PassKeyContainer() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-y-2">
      <PasskeyCard
        linkArea={
          <Link
            className="text-sm ml-2 text-blue-500 hover:text-blue-500/80"
            href="/"
          >
            Return to Home
          </Link>
        }
      >
        <Card.Header>
          <Card.Title>Secure Your Account with a Passkey</Card.Title>
          <Card.Description>
            Passkeys offer a fast and secure way to sign in without passwords.
            Register your passkey now to enhance security.
          </Card.Description>
        </Card.Header>
      </PasskeyCard>
    </div>
  )
}
