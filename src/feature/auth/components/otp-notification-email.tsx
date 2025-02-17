import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Tailwind,
  Text,
} from '@react-email/components'
import { tv } from 'tailwind-variants'

const otpNotificationEmailStyles = tv({
  slots: {
    body: 'm-auto bg-white font-sans',
    container:
      'mx-auto my-10 max-w-[480px] rounded border border-solid border-gray-200 px-10 py-5',
    heading: 'mx-0 my-7 p-0 text-center',
    content: 'ml-1 leading-4',
    code: '',
  },
  compoundSlots: [{ slots: ['heading', 'content'], class: 'text-black' }],
  variants: {
    color: {
      primary: { code: 'text-blue-600' },
    },
    size: {
      sm: { content: 'text-sm' },
      md: { code: 'font-medium' },
      lg: { heading: 'text-xl font-semibold' },
    },
  },
})

type OtpNotificationEmailProps = {
  email: string
  otpCode: string
}

export function OTPNotificationEmail({
  email,
  otpCode,
}: OtpNotificationEmailProps) {
  const { body, container, heading, content, code } =
    otpNotificationEmailStyles()

  return (
    <Html>
      <Head />
      <Preview>OTP確認メール</Preview>
      <Tailwind>
        <Body className={body()}>
          <Container className={container()}>
            <Heading className={heading({ size: 'lg' })}>OTP確認メール</Heading>
            <Text className={content({ size: 'sm' })}>
              あなたのOTPコードは
              <span className={code({ color: 'primary', size: 'md' })}>
                {otpCode}
              </span>
              です。このコードを使用して認証を完了してください。
            </Text>
            <EmailFooter email={email} />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

const emailFooterStyles = tv({
  slots: {
    hrBorder: 'mx-0 my-6 w-full border border-gray-200',
    text: 'text-[12px] leading-6 text-gray-500',
    emailText: 'text-black',
  },
})

type EmailFooterProps = {
  email: string
}

export function EmailFooter({ email }: EmailFooterProps) {
  const { hrBorder, text, emailText } = emailFooterStyles()

  return (
    <Tailwind>
      <Hr className={hrBorder()} />
      <Text className={text()}>
        このメールは<span className={emailText()}>{email}</span>
        宛に送信されました。このメールに心当たりがない場合は、お手数ですがこのまま削除してください。
      </Text>
    </Tailwind>
  )
}
