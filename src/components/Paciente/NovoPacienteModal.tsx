import { X } from '@phosphor-icons/react'
import * as Dialog from '@radix-ui/react-dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { Controller, useForm } from 'react-hook-form'
import DatePicker from 'react-datepicker'
import { ptBR } from 'date-fns/locale'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../store/store'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { addPaciente } from '../../store/pacientesSlice'

const NovoPacienteFormSchema = z.object({
  nomePaciente: z.string().min(1, 'Nome do paciente é obrigatório'),
  dtNascimento: z.date().refine((data) => data <= new Date(), {
    message: 'Data de entrada não pode ser maior que a data atual',
  }),
  terapeutaId: z.string().min(1, 'Selecione um(a) terapeuta'),
  nomeResponsavel: z.string(),
  telefoneResponsavel: z.string(),
  emailResponsavel: z.string(),
  cpfResponsavel: z.string(),
  enderecoResponsavel: z.string(),
  origem: z.enum(['Indicação', 'Instagram', 'Busca no Google', 'Outros']),
})

type NovoPacienteFormInputs = z.infer<typeof NovoPacienteFormSchema>

export function NovoPacienteModal() {
  const dispatch = useDispatch<AppDispatch>()
  const terapeutas = useSelector((state: RootState) => state.terapeutas.data)
  const [mensagemSucesso, setMensagemSucesso] = useState('')
  const [mensagemErro, setMensagemErro] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting, errors },
  } = useForm<NovoPacienteFormInputs>({
    resolver: zodResolver(NovoPacienteFormSchema),
  })

  async function handleCreateNewPaciente(data: NovoPacienteFormInputs) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const terapeutaSelecionado = terapeutas.find(
        (terapeuta) => terapeuta.id === data.terapeutaId,
      )

      if (!terapeutaSelecionado) {
        throw new Error('Terapeuta não encontrado')
      }

      const novoPaciente = {
        id: uuidv4(),
        nomePaciente: data.nomePaciente,
        dtNascimento: data.dtNascimento,
        terapeutaInfo: terapeutaSelecionado,
        nomeResponsavel: data.nomeResponsavel,
        telefoneResponsavel: data.telefoneResponsavel,
        emailResponsavel: data.emailResponsavel,
        cpfResponsavel: data.cpfResponsavel,
        enderecoResponsavel: data.enderecoResponsavel,
        origem: data.origem,
      }

      // Faz o dispatch do thunk addPaciente
      dispatch(addPaciente(novoPaciente)).unwrap()

      reset()
      setMensagemSucesso('Paciente cadastrado com sucesso!')
      setMensagemErro('')
    } catch (error) {
      console.error('Erro ao cadastrar Paciente:', error)
      setMensagemErro('Erro ao cadastrar Paciente. Tente novamente.')
      setMensagemSucesso('')
    }
  }

  function handleFocus() {
    setMensagemSucesso('')
    setMensagemErro('')
  }

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="bg-gray-500/25 data-[state=open]:animate-overlayShow fixed inset-0" />
      <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[768px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
        <Dialog.Title className="sr-only">Cadastrar Novo Paciente</Dialog.Title>
        <Dialog.Description>
          <VisuallyHidden>Cadastrar Novo Paciente</VisuallyHidden>
        </Dialog.Description>
        <form
          onSubmit={handleSubmit(handleCreateNewPaciente)}
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
            {errors.nomePaciente && (
              <p className="text-red-500">{errors.nomePaciente.message}</p>
            )}
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
              id="origem"
              {...register('origem')}
              onFocus={handleFocus}
            >
              <option value="">Selecione a origem</option>
              <option value="Indicação">Indicação</option>
              <option value="Instagram">Instagram</option>
              <option value="Busca no Google">Busca no Google</option>
              <option value="Outros">Outros</option>
            </select>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              className={`bg-azul text-branco hover:bg-azul/75 focus:shadow-azul inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none ${
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
  )
}
