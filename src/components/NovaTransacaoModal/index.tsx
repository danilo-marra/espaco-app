import { X } from '@phosphor-icons/react'
import * as Dialog from '@radix-ui/react-dialog'

export function NovaTransacaoModal() {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="bg-gray-500/25 data-[state=open]:animate-overlayShow fixed inset-0" />
      <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
        <Dialog.Title className="text-rosa m-0 text-[17px] font-medium">
          Nova Transação
        </Dialog.Title>
        <Dialog.Description className="text-rosa mt-[10px] mb-5 text-[15px] leading-normal">
          Faça a inclusão de uma nova transação. Feche quando terminar.
        </Dialog.Description>
        <fieldset className="mb-[15px] flex items-center gap-5">
          <label
            className="text-azul w-[90px] text-right text-[15px]"
            htmlFor="name"
          >
            Name
          </label>
          <input
            className="text-rosa shadow-rosa/50 focus:shadow-rosa inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
            id="name"
            defaultValue="Pedro Duarte"
          />
        </fieldset>
        <fieldset className="mb-[15px] flex items-center gap-5">
          <label
            className="text-azul w-[90px] text-right text-[15px]"
            htmlFor="username"
          >
            Username
          </label>
          <input
            className="text-rosa shadow-rosa/50 focus:shadow-rosa inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
            id="username"
            defaultValue="@peduarte"
          />
        </fieldset>
        <div className="mt-[25px] flex justify-end">
          <Dialog.Close asChild>
            <button className="bg-azul text-branco hover:bg-azul/75 focus:shadow-azul inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none">
              Save changes
            </button>
          </Dialog.Close>
        </div>
        <Dialog.Close asChild>
          <button
            className="text-rosa hover:bg-rosa/50 focus:shadow-azul absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
            aria-label="Close"
          >
            <X />
          </button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  )
}
