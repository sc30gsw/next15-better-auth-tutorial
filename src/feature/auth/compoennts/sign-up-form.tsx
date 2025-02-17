'use client'

import { getFormProps, getInputProps } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { IconTriangleExclamation } from 'justd-icons'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useActionState, type ReactNode } from 'react'
import { toast } from 'sonner'
import { Button, Card, Form, Loader, TextField } from '~/components/justd/ui'
import { signUpAction } from '~/feature/auth/actions/sign-up-action'
import {
  type SignUpInputSchema,
  signUpInputSchema,
} from '~/feature/auth/types/schemas/sign-up-input-schema'
import { useSafeForm } from '~/hooks/use-safe-form'

export function SignUpForm({ children }: { children: ReactNode }) {
  const router = useRouter()

  const [lastResult, action, isPending] = useActionState<
    Awaited<ReturnType<typeof signUpAction>> | null,
    FormData
  >(async (prev, formData) => {
    const result = await signUpAction(prev, formData)
    if (result.status === 'success') {
      toast.success('Sign up successful')
      router.push('/')
    }

    return result
  }, null)

  const [form, fields] = useSafeForm<SignUpInputSchema>({
    constraint: getZodConstraint(signUpInputSchema),
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: signUpInputSchema })
    },
    defaultValue: {
      name: '',
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
              {...getInputProps(fields.name, { type: 'text' })}
              placeholder="Name"
              isDisabled={isPending}
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
            Sign Up
            {isPending && <Loader className="absolute top-3 right-2" />}
          </Button>
          <div className="flex items-center justify-between">
            Already have an account?
            <Link
              className="text-sm ml-2 text-blue-500 hover:text-blue-500/80"
              href="/sign-in"
            >
              Sign in
            </Link>
          </div>
        </Card.Footer>
      </Form>
    </Card>
  )
}
