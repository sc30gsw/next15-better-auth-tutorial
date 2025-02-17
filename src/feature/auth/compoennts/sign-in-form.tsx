'use client'

import { getFormProps, getInputProps } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { IconTriangleExclamation } from 'justd-icons'
import { useRouter } from 'next/navigation'
import React, { useActionState, type ReactNode } from 'react'
import { toast } from 'sonner'
import { Button, Card, Form, Loader, TextField } from '~/components/justd/ui'
import { signInAction } from '~/feature/auth/actions/sign-in-action'
import {
  type SignInInputSchema,
  signInInputSchema,
} from '~/feature/auth/types/schemas/sign-in-input-schema'

import { useSafeForm } from '~/hooks/use-safe-form'

export function SignInForm({
  children,
  notHaveAccountArea,
}: { children: ReactNode; notHaveAccountArea: ReactNode }) {
  const router = useRouter()

  const [lastResult, action, isPending] = useActionState<
    Awaited<ReturnType<typeof signInAction>> | null,
    FormData
  >(async (prev, formData) => {
    const result = await signInAction(prev, formData)
    if (result.status === 'success') {
      toast.success('Sign in successful')
      router.push('/')
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
              isDisabled={isPending}
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
              isDisabled={isPending}
              errorMessage={''}
            />
            <span id={fields.password.errorId} className="text-sm text-red-500">
              {fields.password.errors}
            </span>
          </div>
        </Card.Content>
        <Card.Footer className="flex flex-col items-start gap-y-2 w-full">
          <Button
            type="submit"
            className="w-full relative"
            isDisabled={isPending}
          >
            Sign In
            {isPending && <Loader className="absolute top-3 right-2" />}
          </Button>
          {notHaveAccountArea}
        </Card.Footer>
      </Form>
    </Card>
  )
}
