import React from 'react'
import { Card } from '~/components/justd/ui'
import { SignUpForm } from '~/feature/auth/compoennts/sign-up-form'

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center h-dvh">
      <SignUpForm>
        <Card.Header>
          <Card.Title>Sign Up</Card.Title>
          <Card.Description>Create an account to get started</Card.Description>
        </Card.Header>
      </SignUpForm>
    </div>
  )
}
