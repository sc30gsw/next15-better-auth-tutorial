'use client'

import type { InferResponseType } from 'hono'
import { IconKey } from 'justd-icons'
import { use } from 'react'
import { Button, Modal } from '~/components/justd/ui'
import { PassKeyContainer } from '~/feature/auth/components/pass-key-container'
import type { client } from '~/lib/rpc'

type PassKeyModalProps = {
  passKeyPromise: Promise<
    InferResponseType<(typeof client.api)['pass-keys']['$get'], 200>
  >
}

export function PassKeyModal({ passKeyPromise }: PassKeyModalProps) {
  const res = use(passKeyPromise)

  if (res.passKey) {
    return null
  }

  return (
    <Modal>
      <Modal.Trigger>
        <Button>
          <IconKey />
          Add Passkey
        </Button>
      </Modal.Trigger>
      <Modal.Content>
        <Modal.Body>
          <PassKeyContainer />
        </Modal.Body>
      </Modal.Content>
    </Modal>
  )
}
