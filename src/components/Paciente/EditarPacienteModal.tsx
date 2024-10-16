import { X } from '@phosphor-icons/react'
import * as Dialog from '@radix-ui/react-dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { useEditarPacienteForm } from '../../hooks/Pacientes/useEditarPacienteForm'
import type { EditarPacienteFormInputs } from '../../hooks/Pacientes/validationSchemasPaciente'
import { Controller } from 'react-hook-form'
import DatePicker from 'react-datepicker'
import { ptBR } from 'date-fns/locale'

interface EditarPacienteModalProps {
  pacienteId: string
  open: boolean
  onClose: () => void
}

export function EditarPacienteModal({
  pacienteId,
  open,
  onClose,
}: EditarPacienteModalProps) {
  const {
    register,
    errors,
    handleSubmit,
    handleEditPaciente,
    isSubmitting,
    mensagemSucesso,
    mensagemErro,
    handleFocus,
    terapeutas,
    setMensagemSucesso,
    setMensagemErro,
    control,
  } = useEditarPacienteForm(pacienteId)

  async function onSubmit(data: EditarPacienteFormInputs) {
    try {
      const mensagem = await handleEditPaciente(data)
      setMensagemSucesso(mensagem)
      setMensagemErro('')
      onClose()
    } catch (error) {
      if (error instanceof Error) {
        setMensagemErro(error.message)
      } else {
        setMensagemErro('An unknown error occurred')
      }
      setMensagemSucesso('')
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-gray-500/25 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[768px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className="sr-only">Editar Paciente</Dialog.Title>
          <Dialog.Description>
            <VisuallyHidden>Editar Paciente</VisuallyHidden>
          </Dialog.Description>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 p-6 bg-white rounded-lg"
          >
            <h3 className="font-medium text-azul text-xl mt-6">
              Dados do Paciente
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                className="shadow-rosa/50 focus:shadow-rosa block w-full h-[40px] rounded-md px-4 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                id="nome"
                placeholder="Nome do paciente"
                {...register('nomePaciente')}
                onFocus={handleFocus}
              />
              <Controller
                control={control}
                name="dtNascimento"
                render={({ field }) => (
                  <DatePicker
                    className="shadow-rosa/50 focus:shadow-rosa block w-full h-[40px] rounded-md px-4 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                    id="dtNascimento"
                    placeholderText="Data de nascimento"
                    selected={field.value ? new Date(field.value) : null} // Converte a data para o formato Date
                    onChange={(date) =>
                      field.onChange(date ? date.toISOString() : '')
                    } // Converte a data para o formato ISOString
                    dateFormat="dd/MM/yyyy"
                    locale={ptBR}
                    onFocus={handleFocus}
                    autoComplete="off"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                  />
                )}
              />
              {errors.dtNascimento && (
                <p className="text-red-500">{errors.dtNascimento.message}</p>
              )}
              <select
                className="shadow-rosa/50 focus:shadow-rosa block w-full h-[40px] rounded-md px-4 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                id="nomeTerapeuta"
                {...register('nomeTerapeuta')}
                onFocus={handleFocus}
              >
                <option value="">Selecione o terapeuta</option>
                {terapeutas.map((terapeuta) => (
                  <option key={terapeuta.id} value={terapeuta.nomeTerapeuta}>
                    {terapeuta.nomeTerapeuta}
                  </option>
                ))}
              </select>
            </div>

            <h3 className="font-medium text-azul text-xl mt-6">
              Dados do Responsável
            </h3>

            <div className="space-y-4">
              <input
                type="text"
                className="shadow-rosa/50 focus:shadow-rosa block w-full h-[40px] rounded-md px-4 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                id="nomeResponsavel"
                placeholder="Nome do responsável"
                {...register('nomeResponsavel')}
                onFocus={handleFocus}
              />
              <input
                type="text"
                className="shadow-rosa/50 focus:shadow-rosa block w-full h-[40px] rounded-md px-4 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                id="telefoneResponsavel"
                placeholder="Telefone do responsável"
                {...register('telefoneResponsavel')}
                onFocus={handleFocus}
              />
              <input
                type="email"
                className="shadow-rosa/50 focus:shadow-rosa block w-full h-[40px] rounded-md px-4 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                id="emailResponsavel"
                placeholder="Email do responsável"
                {...register('emailResponsavel')}
                onFocus={handleFocus}
              />
              <input
                type="text"
                className="shadow-rosa/50 focus:shadow-rosa block w-full h-[40px] rounded-md px-4 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                id="cpfResponsavel"
                placeholder="CPF do responsável"
                {...register('cpfResponsavel')}
                onFocus={handleFocus}
              />
              <input
                type="text"
                className="shadow-rosa/50 focus:shadow-rosa block w-full h-[40px] rounded-md px-4 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                id="enderecoResponsavel"
                placeholder="Endereço do responsável"
                {...register('enderecoResponsavel')}
                onFocus={handleFocus}
              />
              <select
                className="shadow-rosa/50 focus:shadow-rosa block w-full h-[40px] rounded-md px-4 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                {...register('origem')}
                defaultValue=""
                onFocus={handleFocus}
              >
                <option disabled value="">
                  Selecione a origem
                </option>
                <option>Indicação</option>
                <option>Instagram</option>
                <option>Busca no Google</option>
                <option>Outros</option>
              </select>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                className={`bg-azul text-branco hover:bg-azul/75 focus:shadow-azul inline-flex h-[40px] items-center justify-center rounded-md px-6 font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none ${
                  isSubmitting ? 'cursor-not-allowed' : ''
                }`}
                type="submit"
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
