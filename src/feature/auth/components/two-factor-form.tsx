'use client'

import { getFormProps, getInputProps } from '@conform-to/react'
import { IconKey } from 'justd-icons'
import type { ReactNode } from 'react'
import { Button, Card, Form, Loader, TextField } from '~/components/justd/ui'

import { useTwoFactor } from '~/feature/auth/hooks/use-two-factor'

export function TwoFactorForm({ children }: { children: ReactNode }) {
  const { form, fields, action, isPending } = useTwoFactor()

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
