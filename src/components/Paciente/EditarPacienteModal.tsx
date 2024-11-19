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
import { maskCPF, maskPhone } from '@/utils/formatter'
import { toast } from 'sonner'

const EditarPacienteFormSchema = z.object({
  id: z.string(),
  nomePaciente: z.string().min(1, 'Nome do paciente é obrigatório'),
  dtNascimento: z.date().refine((data) => data <= new Date(), {
    message: 'Data de entrada não pode ser maior que a data atual',
  }),
  terapeutaId: z.string().min(1, 'Selecione um(a) terapeuta'), // Alterado aqui
  nomeResponsavel: z.string(),
  telefoneResponsavel: z
    .string()
    .min(14, 'Telefone é obrigatório')
    .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/),
  emailResponsavel: z.string(),
  cpfResponsavel: z
    .string()
    .min(14, 'CPF é obrigatório')
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/),
  enderecoResponsavel: z.string(),
  origem: z.enum(['Indicação', 'Instagram', 'Busca no Google', 'Outros']),
  dtEntradaPaciente: z.date().nullable().optional(),
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
    defaultValues: {
      id: '',
      nomePaciente: '',
      dtNascimento: new Date(),
      terapeutaId: '',
      nomeResponsavel: '',
      telefoneResponsavel: '',
      emailResponsavel: '',
      cpfResponsavel: '',
      enderecoResponsavel: '',
      origem: 'Indicação',
      dtEntradaPaciente: new Date(),
    },
  })

  useEffect(() => {
    const paciente = pacientes.find((p) => p.id === pacienteId)
    if (paciente) {
      reset({
        id: paciente.id,
        nomePaciente: paciente.nomePaciente,
        dtNascimento: new Date(paciente.dtNascimento),
        terapeutaId: paciente.terapeutaInfo.id,
        nomeResponsavel: paciente.nomeResponsavel,
        telefoneResponsavel: paciente.telefoneResponsavel,
        emailResponsavel: paciente.emailResponsavel,
        cpfResponsavel: paciente.cpfResponsavel,
        enderecoResponsavel: paciente.enderecoResponsavel,
        origem: paciente.origem ?? 'Indicação',
        dtEntradaPaciente: new Date(paciente.dtEntradaPaciente),
      })
    }
  }, [pacienteId, pacientes, reset])

  async function handleEditPaciente(data: EditarPacienteFormInputs) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const terapeutaInfo = terapeutas.find(
        (terapeuta) => terapeuta.id === data.terapeutaId,
      )

      if (!terapeutaInfo) {
        throw new Error('Terapeuta não encontrado')
      }

      const pacienteEditado = {
        id: data.id,
        nomePaciente: data.nomePaciente,
        dtNascimento: data.dtNascimento,
        terapeutaInfo,
        nomeResponsavel: data.nomeResponsavel,
        telefoneResponsavel: data.telefoneResponsavel,
        emailResponsavel: data.emailResponsavel,
        cpfResponsavel: data.cpfResponsavel,
        enderecoResponsavel: data.enderecoResponsavel,
        origem: data.origem,
        dtEntradaPaciente: data.dtEntradaPaciente || new Date(), // Usa data atual se não preenchido
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
      toast.success('Paciente atualizado com sucesso!')
      onClose()
    } catch (error) {
      toast.error('Erro ao editar paciente')
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
                id="nomePaciente"
                placeholder="Nome do paciente"
                {...register('nomePaciente')}
                onFocus={handleFocus}
              />
              <div className="flex space-x-4">
                <div>
                  <Controller
                    control={control}
                    name="dtNascimento"
                    render={({ field }) => (
                      <DatePicker
                        className="shadow-rosa/50 focus:shadow-rosa block w-full h-[40px] rounded-md px-4 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                        id="dtNascimento"
                        placeholderText="Data de nascimento"
                        selected={field.value}
                        onChange={(date) => field.onChange(date)}
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
                    <p className="text-red-500">
                      {errors.dtNascimento.message}
                    </p>
                  )}
                </div>
                <div>
                  <Controller
                    control={control}
                    name="dtEntradaPaciente"
                    render={({ field }) => (
                      <DatePicker
                        className="shadow-rosa/50 focus:shadow-rosa block w-full h-[40px] rounded-md px-4 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                        id="dtEntradaPaciente"
                        placeholderText="Data de entrada"
                        selected={field.value}
                        onChange={(date) => field.onChange(date)}
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
                </div>
              </div>
              {errors.dtNascimento && (
                <p className="text-red-500">{errors.dtNascimento.message}</p>
              )}
              <select
                className="shadow-rosa/50 focus:shadow-rosa block w-full h-[40px] rounded-md px-4 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                id="terapeutaId"
                {...register('terapeutaId')}
                onFocus={handleFocus}
              >
                <option value="">Selecione o terapeuta</option>
                {terapeutas.map((terapeuta) => (
                  <option key={terapeuta.id} value={terapeuta.id}>
                    {terapeuta.nomeTerapeuta}
                  </option>
                ))}
              </select>
              {errors.terapeutaId && (
                <p className="text-red-500">{errors.terapeutaId.message}</p>
              )}
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
                {...register('telefoneResponsavel', {
                  onChange: (e) => {
                    const masked = maskPhone(e.target.value)
                    e.target.value = masked
                  },
                })}
                onFocus={handleFocus}
              />
              {errors.telefoneResponsavel && (
                <p className="text-red-500">
                  {errors.telefoneResponsavel.message}
                </p>
              )}
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
                {...register('cpfResponsavel', {
                  onChange: (e) => {
                    const masked = maskCPF(e.target.value)
                    e.target.value = masked
                  },
                })}
                onFocus={handleFocus}
              />
              {errors.cpfResponsavel && (
                <p className="text-red-500">{errors.cpfResponsavel.message}</p>
              )}
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
