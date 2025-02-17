'use client'

import { getFormProps, getInputProps } from '@conform-to/react'
import { IconBrandGithub, IconTriangleExclamation } from 'justd-icons'
import type { ReactNode } from 'react'
import { Button, Card, Form, Loader, TextField } from '~/components/justd/ui'
import { useSignUp } from '~/feature/auth/hooks/use-sign-up'
import { authClient } from '~/lib/auth/auth-client'

export function SignUpForm({
  children,
  haveAccountArea,
}: { children: ReactNode; haveAccountArea: ReactNode }) {
  const {
    form,
    fields,
    action,
    getError,
    isPending,
    isSignInPending,
    isAnyPending,
    startTransition,
  } = useSignUp()

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
              {...getInputProps(fields.name, { type: 'text' })}
              placeholder="Name"
              isDisabled={isAnyPending}
              errorMessage={''}
            />
            <span id={fields.name.errorId} className="text-sm text-red-500">
              {fields.name.errors}
            </span>
          </div>
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
            Sign Up
            {isPending && <Loader className="absolute top-3 right-2" />}
          </Button>
          <Button
            intent="secondary"
            className="w-full relative"
            isDisabled={isAnyPending}
            onPress={() => {
              startTransition(async () => {
                const data = await authClient.signIn.social({
                  provider: 'github',
                  callbackURL: '/',
                })
              })
            }}
          >
            <IconBrandGithub />
            Sign In with GitHub
            {isSignInPending && <Loader className="absolute top-3 right-2" />}
          </Button>
          {haveAccountArea}
        </Card.Footer>
      </Form>
    </Card>
  )
}
