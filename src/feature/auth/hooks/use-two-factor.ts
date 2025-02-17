import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { useRouter } from 'next/navigation'
import { useActionState } from 'react'
import { toast } from 'sonner'
import { twoFactorEnableAction } from '~/feature/auth/actions/two-factor-enable-action'
import { updateUserForTwoFactorEnable } from '~/feature/auth/actions/update-user-for-two-factor-enable'
import {
  type TwoFactorInputSchema,
  twoFactorInputSchema,
} from '~/feature/auth/types/schemas/two-factor-input-schema'
import { useSafeForm } from '~/hooks/use-safe-form'
import { authClient } from '~/lib/auth/auth-client'

export function useTwoFactor() {
  const router = useRouter()

  const [lastResult, action, isPending] = useActionState<
    Awaited<ReturnType<typeof twoFactorEnableAction> | null>,
    FormData
  >(async (prev, formData) => {
    const result = await twoFactorEnableAction(prev, formData)

    if (result.status === 'success') {
      const { error: twoFactorEnableError } = await authClient.twoFactor.enable(
        {
          password: result.initialValue?.password.toString() ?? '',
        },
      )

      if (twoFactorEnableError) {
        toast.error('Something went wrong')

        return null
      }

      const { error: sendOtpError } = await authClient.twoFactor.sendOtp()

      if (sendOtpError) {
        toast.error('Something went wrong')

        return null
      }

      const { isSuccess } = await updateUserForTwoFactorEnable()

      if (!isSuccess) {
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

  return {
    form,
    fields,
    action,
    isPending,
  }
}
