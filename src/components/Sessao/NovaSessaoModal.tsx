import { X } from '@phosphor-icons/react'
import * as Dialog from '@radix-ui/react-dialog'
import * as RadioGroup from '@radix-ui/react-radio-group'
import { v4 as uuidv4 } from 'uuid'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../store/store'
import { useEffect, useMemo, useState } from 'react'
import { fetchPacientes } from '../../store/pacientesSlice'
import { fetchTerapeutas } from '../../store/terapeutasSlice'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ptBR } from 'date-fns/locale'
import DatePicker from 'react-datepicker'
import { addSessao } from '../../store/sessoesSlice'

// Schema de validação
const novaSessaoFormSchema = z.object({
  terapeutaId: z.string().min(1, 'Selecione um terapeuta'),
  pacienteId: z.string().min(1, 'Selecione um paciente'),
  statusSessao: z.enum([
    'Pagamento Pendente',
    'Pagamento Realizado',
    'Nota Fiscal Emitida',
    'Nota Fiscal Enviada',
  ]),
  valorSessao: z.number().positive('O valor deve ser maior que zero'),
  dtSessao1: z.date().refine((date) => date !== null, {
    message: 'Pelo menos uma data de sessão é obrigatória',
  }),
  dtSessao2: z.date().optional(),
  dtSessao3: z.date().optional(),
  dtSessao4: z.date().optional(),
  dtSessao5: z.date().optional(),
  dtSessao6: z.date().optional(),
})

type NovaSessaoFormInputs = z.infer<typeof novaSessaoFormSchema>

export function NovaSessaoModal() {
  const dispatch = useDispatch<AppDispatch>()
  const terapeutas = useSelector((state: RootState) => state.terapeutas.data)
  const pacientes = useSelector((state: RootState) => state.pacientes.data)
  const [mensagemSucesso, setMensagemSucesso] = useState('')
  const [mensagemErro, setMensagemErro] = useState('')
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<NovaSessaoFormInputs>({
    resolver: zodResolver(novaSessaoFormSchema),
  })

  const pacienteId = watch('pacienteId')
  const terapeutaId = watch('terapeutaId')
  const pacienteSelecionado = useMemo(
    () => pacientes.find((paciente) => paciente.id === pacienteId),
    [pacienteId, pacientes],
  )

  useEffect(() => {
    dispatch(fetchPacientes())
    dispatch(fetchTerapeutas())
  }, [dispatch])

  async function handleCreateNewSessao(data: NovaSessaoFormInputs) {
    try {
      // Aqui você implementaria a lógica de criar a sessão
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const terapeutaSelecionado = terapeutas.find(
        (terapeuta) => terapeuta.id === data.terapeutaId,
      )

      if (!terapeutaSelecionado) {
        throw new Error('Terapeuta não encontrado')
      }

      const pacienteSelecionado = pacientes.find(
        (paciente) => paciente.id === data.pacienteId,
      )

      if (!pacienteSelecionado) {
        throw new Error('Paciente não encontrado')
      }

      const novaSessao = {
        id: uuidv4(),
        terapeutaInfo: terapeutaSelecionado,
        pacienteInfo: pacienteSelecionado,
        statusSessao: data.statusSessao,
        valorSessao: data.valorSessao,
        dtSessao1: data.dtSessao1,
        dtSessao2: data.dtSessao2,
        dtSessao3: data.dtSessao3,
        dtSessao4: data.dtSessao4,
        dtSessao5: data.dtSessao5,
        dtSessao6: data.dtSessao6,
      }

      // Faz o dispatch do thunk addSessao
      dispatch(addSessao(novaSessao)).unwrap()

      reset() // Limpa o formulário após sucesso
      // Adicionar notificação de sucesso
      setMensagemSucesso('Sessão criada com sucesso!')
      setMensagemErro('') // Limpa a mensagem de erro, se houver
      console.log('Nova sessão criada:', {
        ...data,
        terapeutaInfo: terapeutaSelecionado,
        pacienteInfo: pacienteSelecionado,
      })
    } catch (error) {
      console.error('Erro ao criar nova sessão:', error)
      // Adicionar notificação de erro
      setMensagemErro('Erro ao criar sessão. Tente novamente.')
      setMensagemSucesso('') // Limpa a mensagem de sucesso, se houver
    }
  }

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="bg-gray-500/25 data-[state=open]:animate-overlayShow fixed inset-0" />
      <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[768px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
        <Dialog.Title className="text-2xl font-bold text-azul mb-6">
          Nova Sessão
        </Dialog.Title>

        <form
          onSubmit={handleSubmit(handleCreateNewSessao)}
          className="space-y-6 bg-white rounded-lg"
        >
          <h3 className="font-medium text-azul text-xl mb-4">Terapeuta</h3>
          <div className="space-y-2">
            <select
              className={`shadow-rosa/50 focus:shadow-rosa block w-full h-[40px] rounded-md px-4 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px] ${
                errors.terapeutaId ? 'border-red-500' : ''
              }`}
              {...register('terapeutaId')}
            >
              <option value="">Selecione um terapeuta</option>
              {terapeutas.map((terapeuta) => (
                <option key={terapeuta.id} value={terapeuta.id}>
                  {terapeuta.nomeTerapeuta}
                </option>
              ))}
            </select>
            {errors.terapeutaId && (
              <p className="text-red-500 text-sm">
                {errors.terapeutaId.message}
              </p>
            )}
          </div>

          <h3 className="font-medium text-azul text-xl mb-4">
            Dados do Paciente
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <select
                className={`shadow-rosa/50 focus:shadow-rosa block w-full h-[40px] rounded-md px-4 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px] ${
                  errors.pacienteId ? 'border-red-500' : ''
                }`}
                {...register('pacienteId')}
              >
                <option value="">Selecione um paciente</option>
                {pacientes
                  .filter(
                    (paciente) => paciente.terapeutaInfo.id === terapeutaId,
                  )
                  .map((paciente) => (
                    <option key={paciente.id} value={paciente.id}>
                      {paciente.nomePaciente}
                    </option>
                  ))}
              </select>
              {errors.pacienteId && (
                <p className="text-red-500 text-sm">
                  {errors.pacienteId.message}
                </p>
              )}
            </div>
            <input
              type="text"
              disabled
              className="shadow-rosa/50 focus:shadow-rosa w-full h-[40px] rounded-md px-4 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px] bg-gray-100"
              placeholder="Nome do Responsável"
              value={`Responsável: ${pacienteSelecionado?.nomeResponsavel || ''}`}
            />
            <h3 className="font-medium text-azul text-xl mb-4">
              Dados da Sessão
            </h3>
            <div className="flex items-center gap-4">
              <Controller
                control={control}
                name="statusSessao"
                render={({ field }) => (
                  <RadioGroup.Root
                    className="flex items-center gap-4"
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value}
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroup.Item
                        className="w-[20px] h-[20px] border border-rosa rounded-full flex items-center justify-center"
                        value="Pagamento Pendente"
                        id="Pagamento Pendente"
                      >
                        <RadioGroup.Indicator className="w-[10px] h-[10px] bg-red-600 rounded-full" />
                      </RadioGroup.Item>
                      <label
                        className="text-black text-[17px] leading-none"
                        htmlFor="Pagamento Pendente"
                      >
                        Pagamento Pendente
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <RadioGroup.Item
                        className="w-[20px] h-[20px] border border-rosa rounded-full flex items-center justify-center"
                        value="Pagamento Realizado"
                        id="Pagamento Realizado"
                      >
                        <RadioGroup.Indicator className="w-[10px] h-[10px] bg-orange-500 rounded-full" />
                      </RadioGroup.Item>
                      <label
                        className="text-black text-[17px] leading-none"
                        htmlFor="Pagamento Realizado"
                      >
                        Pagamento Realizado
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <RadioGroup.Item
                        className="w-[20px] h-[20px] border border-rosa rounded-full flex items-center justify-center"
                        value="Nota Fiscal Emitida"
                        id="Nota Fiscal Emitida"
                      >
                        <RadioGroup.Indicator className="w-[10px] h-[10px] bg-yellow-500 rounded-full" />
                      </RadioGroup.Item>
                      <label
                        className="text-black text-[17px] leading-none"
                        htmlFor="Nota Fiscal Emitida"
                      >
                        Nota Fiscal Emitida
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <RadioGroup.Item
                        className="w-[20px] h-[20px] border border-rosa rounded-full flex items-center justify-center"
                        value="Nota Fiscal Enviada"
                        id="Nota Fiscal Enviada"
                      >
                        <RadioGroup.Indicator className="w-[10px] h-[10px] bg-green-600 rounded-full" />
                      </RadioGroup.Item>
                      <label
                        className="text-black text-[17px] leading-none"
                        htmlFor="Nota Fiscal Enviada"
                      >
                        Nota Fiscal Enviada
                      </label>
                    </div>
                  </RadioGroup.Root>
                )}
              />
            </div>

            <input
              type="number"
              className="shadow-rosa/50 focus:shadow-rosa block w-full h-[40px] rounded-md px-4 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
              placeholder="Valor da sessão"
              required
              {...register('valorSessao', { valueAsNumber: true })}
            />

            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <label>Data sessão 1:</label>
                <Controller
                  control={control}
                  name="dtSessao1"
                  render={({ field }) => (
                    <DatePicker
                      className="shadow-rosa/50 focus:shadow-rosa block h-[40px] rounded-md px-4 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                      placeholderText="Data da Sessão"
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      dateFormat="dd/MM/yyyy"
                      locale={ptBR}
                      autoComplete="off"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                    />
                  )}
                />
                <label>Data sessão 2:</label>
                <Controller
                  control={control}
                  name="dtSessao2"
                  render={({ field }) => (
                    <DatePicker
                      className="shadow-rosa/50 focus:shadow-rosa block h-[40px] rounded-md px-4 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                      placeholderText="Data da Sessão"
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      dateFormat="dd/MM/yyyy"
                      locale={ptBR}
                      autoComplete="off"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                    />
                  )}
                />
              </div>
              <div className="flex justify-between items-center">
                <label>Data sessão 3:</label>
                <Controller
                  control={control}
                  name="dtSessao3"
                  render={({ field }) => (
                    <DatePicker
                      className="shadow-rosa/50 focus:shadow-rosa block h-[40px] rounded-md px-4 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                      placeholderText="Data da Sessão"
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      dateFormat="dd/MM/yyyy"
                      locale={ptBR}
                      autoComplete="off"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                    />
                  )}
                />
                <label>Data sessão 4:</label>
                <Controller
                  control={control}
                  name="dtSessao4"
                  render={({ field }) => (
                    <DatePicker
                      className="shadow-rosa/50 focus:shadow-rosa block h-[40px] rounded-md px-4 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                      placeholderText="Data da Sessão"
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      dateFormat="dd/MM/yyyy"
                      locale={ptBR}
                      autoComplete="off"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                    />
                  )}
                />
              </div>
              <div className="flex justify-between items-center">
                <label>Data sessão 5:</label>
                <Controller
                  control={control}
                  name="dtSessao5"
                  render={({ field }) => (
                    <DatePicker
                      className="shadow-rosa/50 focus:shadow-rosa block h-[40px] rounded-md px-4 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                      placeholderText="Data da Sessão"
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      dateFormat="dd/MM/yyyy"
                      locale={ptBR}
                      autoComplete="off"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                    />
                  )}
                />
                <label>Data sessão 6:</label>
                <Controller
                  control={control}
                  name="dtSessao6"
                  render={({ field }) => (
                    <DatePicker
                      className="shadow-rosa/50 focus:shadow-rosa block h-[40px] rounded-md px-4 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                      placeholderText="Data da Sessão"
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      dateFormat="dd/MM/yyyy"
                      locale={ptBR}
                      autoComplete="off"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                    />
                  )}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-rosa hover:bg-rosa/90 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </button>
        </form>
        {mensagemSucesso && (
          <p className="text-green-500 text-sm mt-4">{mensagemSucesso}</p>
        )}
        {mensagemErro && (
          <p className="text-red-500 text-sm mt-4">{mensagemErro}</p>
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
