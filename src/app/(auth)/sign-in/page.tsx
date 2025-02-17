import Link from 'next/link'
import React from 'react'
import { Card } from '~/components/justd/ui'
import { SignInForm } from '~/feature/auth/components/sign-in-form'

const SignInPage = () => {
  return (
    <SignInForm
      notHaveAccountArea={
        <div className="flex items-center justify-between">
          Don&apos;t have an account?{' '}
          <Link
            className="text-sm ml-2 text-blue-500 hover:text-blue-500/80"
            href="/sign-up"
          >
            Sign up
          </Link>
        </div>
      }
    >
      <Card.Header>
        <Card.Title>Sign In</Card.Title>
        <Card.Description>Sign in to your account</Card.Description>
      </Card.Header>
    </SignInForm>
  )
}

export default SignInPage
