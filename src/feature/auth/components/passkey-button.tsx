import { type JSX, useTransition } from 'react'
import { Button, Loader } from '~/components/justd/ui'

type PasskeyButtonProps = {
  isDisabled?: boolean
  icon: JSX.Element
  label: string
  onClick: () => Promise<void>
}

export function PasskeyButton({
  isDisabled,
  icon,
  label,
  onClick,
}: PasskeyButtonProps) {
  const [isPending, startTransition] = useTransition()

  return (
    <Button
      isDisabled={isPending || isDisabled}
      onPress={() => {
        startTransition(async () => await onClick())
      }}
      className="w-full"
    >
      {icon}
      {label}
      {isPending && <Loader className="absolute top-3 right-2" />}
    </Button>
  )
}
