import { type FieldMetadata, getInputProps } from '@conform-to/react'
import React, { useEffect, type ComponentProps } from 'react'
import { TextField } from '~/components/justd/ui'
import type { SignInInputSchema } from '~/feature/auth/types/schemas/sign-in-input-schema'
import { authClient } from '~/lib/auth/auth-client'

type SignInWithPasskeyTextFieldProps = {
  metadata: FieldMetadata<string, SignInInputSchema, string[]>
  options: Parameters<typeof getInputProps>[1]
}

export function SignInWithPasskeyTextField({
  metadata,
  options,
  ...props
}: SignInWithPasskeyTextFieldProps & ComponentProps<typeof TextField>) {
  useEffect(() => {
    if (
      !PublicKeyCredential.isConditionalMediationAvailable ||
      !PublicKeyCredential.isConditionalMediationAvailable()
    ) {
      return
    }

    void authClient.signIn.passkey({ autoFill: true })
  }, [])

  return (
    <TextField
      {...getInputProps(metadata, options)}
      placeholder={props.placeholder}
      isDisabled={props.isDisabled}
      errorMessage={props.errorMessage}
      autoComplete={props.autoComplete}
    />
  )
}
