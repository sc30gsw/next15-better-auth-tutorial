'use client'

import { getFormProps, getInputProps } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { IconKey } from 'justd-icons'
import { useRouter } from 'next/navigation'
import React, { useActionState, type ReactNode } from 'react'
import { toast } from 'sonner'
import {
  Button,
  Card,
  Form,
  InputOTP,
  Loader,
  TextField,
} from '~/components/justd/ui'
import { twoFactorEnableAction } from '~/feature/auth/actions/two-factor-enable-action'
import {
  type TwoFactorInputSchema,
  twoFactorInputSchema,
} from '~/feature/auth/types/schemas/two-factor-input-schema'
import { useSafeForm } from '~/hooks/use-safe-form'
import { authClient } from '~/lib/auth/auth-client'

export function TwoFactorForm({ children }: { children: ReactNode }) {
  const router = useRouter()

  const [lastResult, action, isPending] = useActionState<
    Awaited<ReturnType<typeof twoFactorEnableAction> | null>,
    FormData
  >(async (prev, formData) => {
    const result = await twoFactorEnableAction(prev, formData)

    if (result.status === 'success') {
      const res = await authClient.twoFactor.enable({
        password: result.initialValue?.password.toString() ?? '',
      })

      if (res.error) {
        toast.error('Something went wrong')

        return null
      }

      const { error } = await authClient.twoFactor.sendOtp()

      if (error) {
        toast.error('Something went wrong')

        return null
      }

      toast.success('Send your OTP to your email')
      router.refresh()

      return null
    }

    return result
  }, null)

  const [form, fields] = useSafeForm<TwoFactorInputSchema>({
    constraint: getZodConstraint(twoFactorInputSchema),
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: twoFactorInputSchema })
    },
    defaultValue: {
      password: '',
    },
  })

  return (
    <Card className="mx-auto w-full max-w-md">
      {children}
      <Card.Content className="space-y-6 w-full">
        <Form
          {...getFormProps(form)}
          action={action}
          className="flex flex-col items-center justify-center w-full"
        >
          <div className="w-full">
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
        </Form>
      </Card.Content>
      <Card.Footer className="flex flex-col items-start gap-y-4 w-full">
        <Button
          type="submit"
          className="w-full relative"
          isDisabled={isPending}
        >
          <IconKey />
          Enable Two Factor
          {isPending && <Loader className="absolute top-3 right-2" />}
        </Button>
      </Card.Footer>
    </Card>
  )
}
