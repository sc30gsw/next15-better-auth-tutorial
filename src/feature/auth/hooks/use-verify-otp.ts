import { useRouter } from 'next/navigation'
import { parseAsBoolean, useQueryStates } from 'nuqs'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { authClient } from '~/lib/auth/auth-client'

export function useVerifyOtp() {
  const [value, setValue] = useState('')
  const [isShow, setIsShow] = useState(false)

  const [isPending, startTransition] = useTransition()

  const [_, setSearchCondition] = useQueryStates(
    { isPassKey: parseAsBoolean.withDefault(false) },
    {
      shallow: false,
      history: 'push',
    },
  )

  const router = useRouter()

  const verifyOtp = async (code: string) => {
    await authClient.twoFactor.verifyOtp(
      { code },
      {
        onSuccess() {
          toast.success('Verification successful', {
            description: 'Do you want to add passkey?',
            action: {
              label: "Let's add",
              onClick: () => {
                setSearchCondition({ isPassKey: true })
              },
            },
            cancel: {
              label: 'No thanks',
              onClick: () => {
                setSearchCondition({ isPassKey: false })
                router.push('/')
              },
            },
          })

          setValue('')
          setIsShow(true)
        },
        onError(ctx) {
          toast.error(ctx.error.message)
          setValue('')
        },
      },
    )
  }

  return {
    value,
    setValue,
    isShow,
    setSearchCondition,
    isPending,
    startTransition,
    verifyOtp,
  }
}
