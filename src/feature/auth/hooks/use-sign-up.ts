import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { useRouter } from 'next/navigation'
import { useActionState, useTransition } from 'react'
import { toast } from 'sonner'
import { signUpAction } from '~/feature/auth/actions/sign-up-action'
import {
  type SignUpInputSchema,
  signUpInputSchema,
} from '~/feature/auth/types/schemas/sign-up-input-schema'
import { useSafeForm } from '~/hooks/use-safe-form'

export function useSignUp() {
  const router = useRouter()

  const [isSignInPending, startTransition] = useTransition()
  const [lastResult, action, isPending] = useActionState<
    Awaited<ReturnType<typeof signUpAction>> | null,
    FormData
  >(async (prev, formData) => {
    const result = await signUpAction(prev, formData)
    if (result.status === 'success') {
      toast.success('Sign up successful')
      router.push('/two-factor')
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

  return {
    form,
    fields,
    action,
    isPending,
    isSignInPending,
    startTransition,
    isAnyPending: isPending || isSignInPending,
    getError,
  }
}
