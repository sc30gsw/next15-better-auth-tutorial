'use client'

import { getFormProps, getInputProps } from '@conform-to/react'
import { IconBrandGithub, IconKey, IconTriangleExclamation } from 'justd-icons'
import type { ReactNode } from 'react'
import { toast } from 'sonner'
import { Button, Card, Form, Loader, TextField } from '~/components/justd/ui'
import { useSignIn } from '~/feature/auth/hooks/use-sign-in'

import { authClient } from '~/lib/auth/auth-client'

export function SignInForm({
  children,
  notHaveAccountArea,
}: { children: ReactNode; notHaveAccountArea: ReactNode }) {
  const {
    form,
    fields,
    action,
    getError,
    isPending,
    isOauthSignInPending,
    isPasskeyPending,
    startPassKyeTransition,
    startTransition,
    isAnyPending,
    router,
  } = useSignIn()

  return (
    <Card className="mx-auto w-full max-w-md">
      {children}
      <Form
        {...getFormProps(form)}
        action={action}
        className="flex flex-col items-center justify-center w-full"
      >
        <Card.Content className="space-y-6 w-full">
          {getError() && (
            <div className="bg-danger/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-danger mb-6">
              <IconTriangleExclamation className="size-4" />
              <p>{getError()}</p>
            </div>
          )}
          <div>
            <TextField
              {...getInputProps(fields.email, { type: 'email' })}
              placeholder="Email"
              isDisabled={isAnyPending}
              errorMessage={''}
            />
            <span id={fields.email.errorId} className="text-sm text-red-500">
              {fields.email.errors}
            </span>
          </div>
          <div>
            <TextField
              {...getInputProps(fields.password, { type: 'password' })}
              placeholder="Password"
              isDisabled={isAnyPending}
              errorMessage={''}
            />
            <span id={fields.password.errorId} className="text-sm text-red-500">
              {fields.password.errors}
            </span>
          </div>
        </Card.Content>
        <Card.Footer className="flex flex-col items-start gap-y-4 w-full">
          <Button
            type="submit"
            className="w-full relative"
            isDisabled={isAnyPending}
          >
            Sign In
            {isPending && <Loader className="absolute top-3 right-2" />}
          </Button>
          <Button
            intent="secondary"
            className="w-full relative"
            isDisabled={isAnyPending}
            onPress={() => {
              startTransition(async () => {
                await authClient.signIn.social({
                  provider: 'github',
                  callbackURL: '/',
                })
              })
            }}
          >
            <IconBrandGithub />
            Sign In with GitHub
            {isOauthSignInPending && (
              <Loader className="absolute top-3 right-2" />
            )}
          </Button>
          <Button
            isDisabled={isAnyPending}
            onPress={() => {
              startPassKyeTransition(async () => {
                const data = await authClient.signIn.passkey()

                if (data?.error) {
                  toast.error('Failed to sign in with passkey')

                  return
                }

                toast.success('Sign in successful')

                router.push('/')
              })
            }}
            className="w-full"
          >
            <IconKey />
            Sign In with Passkey
            {isPasskeyPending && <Loader className="absolute top-3 right-2" />}
          </Button>
          {notHaveAccountArea}
        </Card.Footer>
      </Form>
    </Card>
  )
}
