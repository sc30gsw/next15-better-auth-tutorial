'use client'

import { IconMail } from 'justd-icons'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { parseAsBoolean, useQueryStates } from 'nuqs'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Button, InputOTP, Loader } from '~/components/justd/ui'
import { useVerifyOtp } from '~/feature/auth/hooks/use-verify-otp'

import { authClient } from '~/lib/auth/auth-client'

export function OtpForm() {
  const {
    value,
    setValue,
    isShow,
    setSearchCondition,
    isPending,
    startTransition,
    verifyOtp,
  } = useVerifyOtp()

  if (isShow) {
    return (
      <div className="flex flex-col items-center gap-y-4">
        <Button onPress={() => setSearchCondition({ isPassKey: true })}>
          Add Passkey
        </Button>
        <Link href={'/'}>Skip</Link>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <InputOTP
        maxLength={6}
        disabled={isPending}
        value={value}
        onChange={(e) => {
          setValue(e)

          if (e.length === 6) {
            // 6文字目が表示されるまで待機する
            setTimeout(() => {
              startTransition(async () => {
                await verifyOtp(e)
              })
            }, 500)

            return
          }
        }}
      >
        <InputOTP.Group>
          {[...Array(6)].map((_, index) => (
            <InputOTP.Slot key={crypto.randomUUID()} index={index} />
          ))}
        </InputOTP.Group>
      </InputOTP>

      <div className="flex justify-end text-primary hover:text-primary/80">
        <Button
          appearance="outline"
          size="small"
          className="relative w-52"
          isDisabled={isPending}
          onPress={async () =>
            startTransition(async () => {
              await authClient.twoFactor.sendOtp()
              setValue('')
              toast.success('Send your OTP to your email')
            })
          }
        >
          <IconMail />
          メールを再送する
          {isPending && <Loader className="absolute top-3 right-2" />}
        </Button>
      </div>
    </div>
  )
}
