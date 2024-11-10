// src/components/Agenda/ExcluirAgendaModal.tsx

import * as Dialog from '@radix-ui/react-dialog'
import { Button } from '../ui/button'

interface ExcluirAgendaModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  title: string
  message: string
  onConfirm: () => void
}

export function ExcluirAgendaModal({
  isOpen,
  onOpenChange,
  title,
  message,
  onConfirm,
}: ExcluirAgendaModalProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 z-50" />
        <Dialog.Content className="fixed z-50 top-1/2 left-1/2 max-w-md w-full -translate-x-1/2 -translate-y-1/2 bg-white rounded-md p-6 shadow-lg focus:outline-none">
          <Dialog.Title className="text-xl font-semibold mb-4">
            {title}
          </Dialog.Title>
          <Dialog.Description className="text-gray-700 mb-6">
            {message}
          </Dialog.Description>
          <div className="flex justify-end space-x-4">
            <Button
              variant="secondary"
              onClick={() => onOpenChange(false)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800"
            >
              Não
            </Button>
            <Button
              variant="default"
              onClick={onConfirm}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Sim
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
