import { Resend } from 'resend'
import { env } from '~/env'
import { OTPNotificationEmail } from '~/feature/auth/components/otp-notification-email'

export const resend = new Resend(env.RESEND_API_KEY)

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: '2段階認証',
    react: OTPNotificationEmail({ email, otpCode: token }),
  })
}
