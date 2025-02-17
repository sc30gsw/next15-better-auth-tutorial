'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button, Modal } from '~/components/justd/ui'

const APPEAR_ALERT_DIALOG_PATHS = ['/']

type TwoFactorAlertDialogProps = {
  isOpen: boolean
}

export function TwoFactorAlertDialog({ isOpen }: TwoFactorAlertDialogProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(
    isOpen && APPEAR_ALERT_DIALOG_PATHS.includes(pathname),
  )

  const router = useRouter()

  return (
    <Modal isOpen={open} onOpenChange={setOpen}>
      <Modal.Content role="alertdialog">
        <Modal.Header>
          <Modal.Title>Two-Factor Authentication is Disabled</Modal.Title>
          <Modal.Description>
            Enhance your account security by enabling two-factor authentication.
          </Modal.Description>
        </Modal.Header>
        <Modal.Footer>
          <Modal.Close appearance="outline">Later</Modal.Close>
          <Button
            intent="danger"
            onPress={() => {
              router.push('/two-factor')
              setOpen(false)
            }}
          >
            Set up now
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  )
}
