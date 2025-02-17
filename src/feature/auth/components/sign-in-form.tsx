'use client'

import { getFormProps, getInputProps } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { IconBrandGithub, IconKey, IconTriangleExclamation } from 'justd-icons'
import { useRouter } from 'next/navigation'
import React, { useActionState, useTransition, type ReactNode } from 'react'
import { toast } from 'sonner'
import { Button, Card, Form, Loader, TextField } from '~/components/justd/ui'
import { signInAction } from '~/feature/auth/actions/sign-in-action'
import { PasskeyButton } from '~/feature/auth/components/passkey-button'
import {
  type SignInInputSchema,
  signInInputSchema,
} from '~/feature/auth/types/schemas/sign-in-input-schema'

import { useSafeForm } from '~/hooks/use-safe-form'
import { authClient } from '~/lib/auth/auth-client'

export function SignInForm({
  children,
  notHaveAccountArea,
}: { children: ReactNode; notHaveAccountArea: ReactNode }) {
  const router = useRouter()

  const [isPasskeyPending, startPassKyeTransition] = useTransition()
  const [isOauthSignInPending, startTransition] = useTransition()
  const [lastResult, action, isPending] = useActionState<
    Awaited<ReturnType<typeof signInAction>> | null,
    FormData
  >(async (prev, formData) => {
    const result = await signInAction(prev, formData)
    if (result.status === 'success') {
      toast.success('Sign in successful')
      router.push('/?isPassKey=true')
    }

    return result
  }, null)

  const [form, fields] = useSafeForm<SignInInputSchema>({
    constraint: getZodConstraint(signInInputSchema),
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: signInInputSchema })
    },
    defaultValue: {
      email: '',
      password: '',
    },
  })

  const getError = () => {
    if (lastResult?.error && Array.isArray(lastResult.error.message)) {
      return lastResult.error.message.join(', ')
    }

    return
  }

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
              isDisabled={isPending || isOauthSignInPending || isPasskeyPending}
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
              isDisabled={isPending || isOauthSignInPending || isPasskeyPending}
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
            isDisabled={isPending || isOauthSignInPending || isPasskeyPending}
          >
            Sign In
            {isPending && <Loader className="absolute top-3 right-2" />}
          </Button>
          <Button
            intent="secondary"
            className="w-full relative"
            isDisabled={isPending || isOauthSignInPending || isPasskeyPending}
            onPress={() => {
              startTransition(async () => {
                const data = await authClient.signIn.social({
                  provider: 'github',
                  callbackURL: '/?isPassKey=true',
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
            isDisabled={isPasskeyPending || isPending || isOauthSignInPending}
            onPress={() => {
              startPassKyeTransition(async () => {
                const data = await authClient.signIn.passkey()
                console.dir(data)

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
