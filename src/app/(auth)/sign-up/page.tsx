import Link from 'next/link'
import React from 'react'
import { Card } from '~/components/justd/ui'
import { SignUpForm } from '~/feature/auth/components/sign-up-form'

export default function SignUpPage() {
  return (
    <SignUpForm
      haveAccountArea={
        <div className="flex items-center justify-between">
          Already have an account?
          <Link
            className="text-sm ml-2 text-blue-500 hover:text-blue-500/80"
            href="/sign-in"
          >
            Sign in
          </Link>
        </div>
      }
    >
      <Card.Header>
        <Card.Title>Sign Up</Card.Title>
        <Card.Description>Create an account to get started</Card.Description>
      </Card.Header>
    </SignUpForm>
  )
}
