import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { useRouter } from 'next/navigation'
import { useActionState, useTransition } from 'react'
import { toast } from 'sonner'
import { signInAction } from '~/feature/auth/actions/sign-in-action'
import {
  type SignInInputSchema,
  signInInputSchema,
} from '~/feature/auth/types/schemas/sign-in-input-schema'
import { useSafeForm } from '~/hooks/use-safe-form'
import { authClient } from '~/lib/auth/auth-client'

export function useSignIn() {
  const router = useRouter()

  const [isPasskeyPending, startPassKyeTransition] = useTransition()
  const [isOauthSignInPending, startTransition] = useTransition()
  const [lastResult, action, isPending] = useActionState<
    Awaited<ReturnType<typeof signInAction> | null>,
    FormData
  >(async (prev, formData) => {
    const actionResult = await signInAction(prev, formData)

    if (actionResult.status === 'error') {
      if (actionResult?.error && Array.isArray(actionResult.error.message)) {
        toast.error(actionResult.error.message.join(', '))
        return null
      }
      toast.error('Failed to sign in')
      return actionResult
    }

    const result = await authClient.twoFactor.sendOtp()

    if (result.error) {
      toast.error('Failed to send OTP')

      return null
    }

    toast.success('OTP sent to your email')
    router.push('/two-factor')

    return null
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

  return {
    form,
    fields,
    action,
    isPasskeyPending,
    startPassKyeTransition,
    isOauthSignInPending,
    startTransition,
    isPending,
    isAnyPending: isPending || isOauthSignInPending || isPasskeyPending,
    getError,
    router,
  }
}
