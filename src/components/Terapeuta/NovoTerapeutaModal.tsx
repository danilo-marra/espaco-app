import { X } from '@phosphor-icons/react'
import * as Dialog from '@radix-ui/react-dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { useNovoTerapeutaForm } from '../../hooks/Terapeutas/useNovoTerapeutaForm'

interface NovoTerapeutaModalProps {
  open: boolean
  onClose: (open: boolean) => void
}

export function NovoTerapeutaModal({ open, onClose }: NovoTerapeutaModalProps) {
  const {
    register,
    errors,
    handleSubmit,
    handleCreateNewTerapeuta,
    isSubmitting,
    mensagemSucesso,
    mensagemErro,
    handleFocus,
  } = useNovoTerapeutaForm()

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-gray-500/25 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[768px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className="sr-only">
            Cadastrar Novo Terapeuta
          </Dialog.Title>
          <Dialog.Description>
            <VisuallyHidden>Cadastrar Novo Terapeuta</VisuallyHidden>
          </Dialog.Description>
          <form
            onSubmit={handleSubmit(handleCreateNewTerapeuta)}
            className="space-y-6 p-6 bg-white rounded-lg"
          >
            <h3 className="font-medium text-azul text-xl mt-6">
              Dados do Terapeuta
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                className="shadow-rosa/50 focus:shadow-rosa block w-full h-[40px] rounded-md px-4 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                id="nomeTerapeuta"
                placeholder="Nome do terapeuta"
                {...register('nomeTerapeuta')}
                onFocus={handleFocus}
              />
              {errors.nomeTerapeuta && (
                <p className="text-red-500">{errors.nomeTerapeuta.message}</p>
              )}
              <input
                type="text"
                className="shadow-rosa/50 focus:shadow-rosa block w-full h-[40px] rounded-md px-4 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                id="telefoneTerapeuta"
                placeholder="Telefone do terapeuta"
                {...register('telefoneTerapeuta')}
                onFocus={handleFocus}
              />
              <input
                type="email"
                className="shadow-rosa/50 focus:shadow-rosa block w-full h-[40px] rounded-md px-4 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                id="emailTerapeuta"
                placeholder="Email do terapeuta"
                {...register('emailTerapeuta')}
                onFocus={handleFocus}
              />
              {errors.emailTerapeuta && (
                <p className="text-red-500">{errors.emailTerapeuta.message}</p>
              )}
              <input
                type="text"
                className="shadow-rosa/50 focus:shadow-rosa block w-full h-[40px] rounded-md px-4 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                id="enderecoTerapeuta"
                placeholder="Endereço do terapeuta"
                {...register('enderecoTerapeuta')}
                onFocus={handleFocus}
              />
              <input
                type="text"
                className="shadow-rosa/50 focus:shadow-rosa block w-full h-[40px] rounded-md px-4 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                id="curriculo"
                placeholder="Curriculo"
                {...register('curriculo')}
                onFocus={handleFocus}
              />
              <input
                type="text"
                className="shadow-rosa/50 focus:shadow-rosa block w-full h-[40px] rounded-md px-4 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                id="chavePix"
                placeholder="Chave PIX"
                {...register('chavePix')}
                onFocus={handleFocus}
              />
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                className="bg-azul text-white px-4 py-2 rounded hover:bg-sky-600 duration-150"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Carregando...' : 'Confirmar'}
              </button>
            </div>
          </form>
          {mensagemSucesso && (
            <div className="mt-4 text-green-500 text-center">
              {mensagemSucesso}
            </div>
          )}
          {mensagemErro && (
            <div className="mt-4 text-red-500 text-center">{mensagemErro}</div>
          )}
          <Dialog.Close
            className="text-rosa hover:bg-rosa/50 focus:shadow-azul absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
            aria-label="Close"
          >
            <X />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
