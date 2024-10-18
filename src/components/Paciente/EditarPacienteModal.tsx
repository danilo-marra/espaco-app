import { X } from '@phosphor-icons/react'
import * as Dialog from '@radix-ui/react-dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import DatePicker from 'react-datepicker'
import { ptBR } from 'date-fns/locale'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../store/store'
import { useEffect, useState } from 'react'
import { fetchPacientes, updatePaciente } from '../../store/pacientesSlice'
import { fetchTerapeutas } from '../../store/terapeutasSlice'

const EditarPacienteFormSchema = z.object({
  id: z.string(),
  nomePaciente: z.string().min(1, 'Nome do paciente é obrigatório'),
  dtNascimento: z.string().min(1, 'Data de nascimento é obrigatória'),
  nomeTerapeuta: z.string().min(1, 'Selecione um(a) terapeuta'),
  nomeResponsavel: z.string(),
  telefoneResponsavel: z.string(),
  emailResponsavel: z.string(),
  cpfResponsavel: z.string(),
  enderecoResponsavel: z.string(),
  origem: z.enum(['Indicação', 'Instagram', 'Busca no Google', 'Outros']),
})

type EditarPacienteFormInputs = z.infer<typeof EditarPacienteFormSchema>

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
  const dispatch = useDispatch<AppDispatch>()
  const terapeutas = useSelector((state: RootState) => state.terapeutas.data)
  const pacientes = useSelector((state: RootState) => state.pacientes.data)
  const [mensagemSucesso, setMensagemSucesso] = useState('')
  const [mensagemErro, setMensagemErro] = useState('')
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<EditarPacienteFormInputs>({
    resolver: zodResolver(EditarPacienteFormSchema),
  })

  useEffect(() => {
    const paciente = pacientes.find((p) => p.id === pacienteId)
    if (paciente) {
      reset({
        id: paciente.id,
        nomePaciente: paciente.nomePaciente,
        dtNascimento: new Date(paciente.dtNascimento).toISOString(),
        nomeTerapeuta: paciente.terapeutaInfo.nomeTerapeuta,
        nomeResponsavel: paciente.nomeResponsavel,
        telefoneResponsavel: paciente.telefoneResponsavel,
        emailResponsavel: paciente.emailResponsavel,
        cpfResponsavel: paciente.cpfResponsavel,
        enderecoResponsavel: paciente.enderecoResponsavel,
        origem: paciente.origem ?? 'Indicação',
      })
    }
  }, [pacienteId, pacientes, reset])

  async function handleEditPaciente(data: EditarPacienteFormInputs) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const terapeutaInfo = terapeutas.find(
        (terapeuta) => terapeuta.nomeTerapeuta === data.nomeTerapeuta,
      )

      if (!terapeutaInfo) {
        throw new Error('Terapeuta não encontrado')
      }

      const pacienteEditado = {
        id: data.id,
        nomePaciente: data.nomePaciente,
        dtNascimento: new Date(data.dtNascimento).toISOString(),
        terapeutaInfo,
        nomeResponsavel: data.nomeResponsavel,
        telefoneResponsavel: data.telefoneResponsavel,
        emailResponsavel: data.emailResponsavel,
        cpfResponsavel: data.cpfResponsavel,
        enderecoResponsavel: data.enderecoResponsavel,
        origem: data.origem,
      }

      await dispatch(updatePaciente(pacienteEditado)).unwrap()

      // Recarrega os terapeutas e pacientes
      dispatch(fetchTerapeutas())
      dispatch(fetchPacientes())

      // Limpa os dados do formulário
      reset()

      setMensagemSucesso('Paciente atualizado com sucesso!')
      setMensagemErro('')
      console.log('Paciente atualizado:', data)
      onClose()
    } catch (error) {
      setMensagemErro('Erro ao editar paciente')
      setMensagemSucesso('')
      console.error('Erro ao editar paciente:', error)
    }
  }

  function handleFocus() {
    setMensagemSucesso('')
    setMensagemErro('')
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
            onSubmit={handleSubmit(handleEditPaciente)}
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
