import { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'

interface ExcluirModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  title: string
  message: string
  onConfirm: () => void
  isSuccess: boolean
}

export function ExcluirModal({
  isOpen,
  onOpenChange,
  title,
  message,
  onConfirm,
  isSuccess,
}: ExcluirModalProps) {
  const [localIsSuccess, setLocalIsSuccess] = useState(isSuccess)

  useEffect(() => {
    setLocalIsSuccess(isSuccess)
  }, [isSuccess])

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
      <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded shadow-lg">
        <Dialog.Title className="text-lg font-bold">{title}</Dialog.Title>
        <Dialog.Description className="mt-2">{message}</Dialog.Description>
        <div className="mt-4 flex justify-end space-x-4">
          {localIsSuccess ? (
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              onClick={() => onOpenChange(false)}
            >
              Fechar
            </button>
          ) : (
            <>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Não
                </button>
              </Dialog.Close>
              <button
                type="button"
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={onConfirm}
              >
                Sim
              </button>
            </>
          )}
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}
