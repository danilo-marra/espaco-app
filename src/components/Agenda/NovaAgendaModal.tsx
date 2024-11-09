import { CalendarIcon } from '@radix-ui/react-icons'
import { cn } from '@/lib/utils'
import { Calendar } from '../ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { ptBR } from 'date-fns/locale'
import { useEffect, useMemo, useRef, useState } from 'react'
import { format } from 'date-fns'
import { Label } from '../ui/label'
import * as RadioGroup from '@radix-ui/react-radio-group'
import {
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from '../ui/dialog'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '@/store/store'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { fetchPacientes } from '@/store/pacientesSlice'
import { v4 as uuidv4 } from 'uuid'
import { addAgendamento } from '@/store/agendamentosSlice'
import { maskTime } from '@/utils/formatter'
import type { Agendamento } from '@/tipos'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

// Schema de validação
const NovaAgendaFormSchema = z.object({
  pacienteId: z.string().min(1, 'Selecione um paciente'),
  dataAgendamento: z.date({
    required_error: 'Selecione uma data',
    invalid_type_error: 'Selecione uma data válida',
  }),
  horarioAgendamento: z
    .string()
    .regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/, 'Formato inválido (hh:mm)'),
  localAgendamento: z.enum(['Sala Verde', 'Sala Azul', 'Não Precisa de Sala'], {
    required_error: 'Selecione uma sala',
    invalid_type_error: 'Selecione uma sala válida',
  }),
  modalidadeAgendamento: z.enum(['Presencial', 'Online'], {
    required_error: 'Selecione uma modalidade',
    invalid_type_error: 'Selecione uma modalidade válida',
  }),
  tipoAgendamento: z.enum(
    [
      'Sessão',
      'Orientação Parental',
      'Visita Escolar',
      'Reunião Escolar',
      'Supervisão',
      'Outros',
    ],
    {
      required_error: 'Selecione um tipo',
      invalid_type_error: 'Selecione um tipo válido',
    },
  ),
  statusAgendamento: z.enum(['Confirmado', 'Remarcado', 'Cancelado'], {
    required_error: 'Selecione um status',
    invalid_type_error: 'Selecione um status válido',
  }),
  observacoesAgendamento: z.string().optional(),
})

type NovaAgendaFormInputs = z.infer<typeof NovaAgendaFormSchema>

export function NovaAgendaModal() {
  const dispatch = useDispatch<AppDispatch>()
  const pacientes = useSelector((state: RootState) => state.pacientes.data)
  const agendamentos = useSelector(
    (state: RootState) => state.agendamentos.data,
  )
  const [mensagemSucesso, setMensagemSucesso] = useState('')
  const [mensagemErro, setMensagemErro] = useState('')
  const calendarTriggerRef = useRef<HTMLButtonElement>(null)
  const [mensagemAlerta, setMensagemAlerta] = useState('')
  const [conflito, setConflito] = useState(false)
  const [mensagemConflito, setMensagemConflito] = useState('')
  const {
    control,
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<NovaAgendaFormInputs>({
    resolver: zodResolver(NovaAgendaFormSchema),
    defaultValues: {
      pacienteId: '',
      dataAgendamento: undefined,
      horarioAgendamento: '',
      localAgendamento: undefined,
      modalidadeAgendamento: undefined,
      tipoAgendamento: undefined,
      statusAgendamento: undefined,
      observacoesAgendamento: '',
    },
  })
  const pacienteId = watch('pacienteId')
  const watchDataAgendamento = watch('dataAgendamento')
  const watchHorarioAgendamento = watch('horarioAgendamento')
  const watchLocalAgendamento = watch('localAgendamento')

  const isButtonDisabled =
    isSubmitting || Object.keys(errors).length > 0 || conflito

  const pacienteSelecionado = useMemo(
    () => pacientes.find((paciente) => paciente.id === pacienteId),
    [pacienteId, pacientes],
  )

  useEffect(() => {
    dispatch(fetchPacientes())
  }, [dispatch])

  // Check for conflicts when these fields change
  useEffect(() => {
    const getMinutesDifference = (time1: string, time2: string) => {
      const [hours1, minutes1] = time1.split(':').map(Number)
      const [hours2, minutes2] = time2.split(':').map(Number)
      return Math.abs(hours1 * 60 + minutes1 - (hours2 * 60 + minutes2))
    }

    if (
      watchDataAgendamento &&
      watchHorarioAgendamento &&
      watchLocalAgendamento
    ) {
      const agendamentosProximos = agendamentos.filter((agendamento) => {
        const mesmaData =
          format(new Date(agendamento.dataAgendamento), 'yyyy-MM-dd') ===
          format(new Date(watchDataAgendamento), 'yyyy-MM-dd')
        const mesmoLocal =
          agendamento.localAgendamento === watchLocalAgendamento

        if (watchLocalAgendamento === 'Não Precisa de Sala') {
          return false
        }

        if (agendamento.localAgendamento === 'Não Precisa de Sala') {
          return false
        }

        if (mesmaData && mesmoLocal) {
          const minutesDiff = getMinutesDifference(
            agendamento.horarioAgendamento,
            watchHorarioAgendamento,
          )
          return minutesDiff < 50
        }

        return false
      })

      // Check for conflicts first
      const conflitos = agendamentosProximos.filter(
        (agendamento) =>
          agendamento.horarioAgendamento === watchHorarioAgendamento,
      )

      if (conflitos.length > 0) {
        const conflito = conflitos[0]
        setConflito(true)
        setMensagemConflito(
          `Já existe um agendamento para ${conflito.pacienteInfo.nomePaciente} com ${conflito.pacienteInfo.terapeutaInfo.nomeTerapeuta} neste horário e local.`,
        )
        setMensagemAlerta('')
      } else {
        setConflito(false)
        setMensagemConflito('')

        // Check for near appointments
        const agendamentosProximosSemConflito = agendamentosProximos.filter(
          (agendamento) =>
            agendamento.horarioAgendamento !== watchHorarioAgendamento,
        )

        if (agendamentosProximosSemConflito.length > 0) {
          const agendamentoProximo = agendamentosProximosSemConflito[0]
          setMensagemAlerta(
            `Atenção: Existe um agendamento para ${agendamentoProximo.pacienteInfo.nomePaciente} às ${agendamentoProximo.horarioAgendamento} (menos de 50 minutos de diferença)`,
          )
        } else {
          setMensagemAlerta('')
        }
      }
    }
  }, [
    watchDataAgendamento,
    watchHorarioAgendamento,
    watchLocalAgendamento,
    agendamentos,
  ])

  // Função para criar um novo agendamento
  async function handleCreateNewAgendamento(data: NovaAgendaFormInputs) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const pacienteSelecionado = pacientes.find(
        (paciente) => paciente.id === data.pacienteId,
      )

      if (!pacienteSelecionado) {
        throw new Error('Paciente não encontrado')
      }

      const novoAgendamento: Agendamento = {
        id: uuidv4(),
        terapeutaInfo: pacienteSelecionado.terapeutaInfo,
        pacienteInfo: pacienteSelecionado,
        dataAgendamento: data.dataAgendamento,
        horarioAgendamento: data.horarioAgendamento,
        localAgendamento: data.localAgendamento,
        modalidadeAgendamento: data.modalidadeAgendamento,
        tipoAgendamento: data.tipoAgendamento,
        statusAgendamento: data.statusAgendamento,
        observacoesAgendamento: data.observacoesAgendamento || '',
      }

      await dispatch(addAgendamento(novoAgendamento)).unwrap()

      reset()
      setConflito(false)
      setMensagemConflito('')
      setMensagemErro('')
      setMensagemAlerta('')
      setMensagemSucesso('Agendamento criado com sucesso!')
    } catch (error) {
      console.error('Erro ao criar novo agendamento:', error)
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Erro ao criar novo agendamento. Tente novamente.'
      setMensagemErro(errorMessage)
      setMensagemSucesso('')
    }
  }

  function handleFocus() {
    setMensagemSucesso('')
    setMensagemErro('')
  }

  return (
    <DialogPortal>
      <DialogOverlay className="bg-gray-500/25 data-[state=open]:animate-overlayShow fixed inset-0" />
      <DialogContent className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[768px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
        <DialogTitle className="text-2xl font-bold text-azul">
          Novo Agendamento
        </DialogTitle>
        <DialogDescription>
          <VisuallyHidden>Cadastrar Novo Agendamento</VisuallyHidden>
        </DialogDescription>
        <form
          onSubmit={handleSubmit(handleCreateNewAgendamento)}
          className="space-y-6 bg-white rounded-lg"
        >
          <label
            className="font-medium text-azul text-xl mb-4"
            htmlFor="pacienteId"
          >
            Paciente
          </label>
          <div className="space-y-2">
            <label className="text-sm text-slate-500" htmlFor="pacienteId">
              Paciente
            </label>
            <Controller
              control={control}
              name="pacienteId"
              render={({ field: { onChange, value } }) => (
                <Select
                  value={value || ''}
                  onValueChange={(val) => {
                    onChange(val)
                    handleFocus()
                  }}
                >
                  <SelectTrigger className="shadow-rosa/50 focus:shadow-rosa w-full h-[40px] rounded-md px-4 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]">
                    <SelectValue placeholder="Selecione um paciente" />
                  </SelectTrigger>
                  <SelectContent>
                    {pacientes.map((paciente) => (
                      <SelectItem key={paciente.id} value={paciente.id}>
                        {paciente.nomePaciente}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.pacienteId && (
              <p className="text-red-500 text-sm">
                {errors.pacienteId.message}
              </p>
            )}
          </div>
          <h3 className="font-medium text-azul text-xl mb-4">Terapeuta</h3>
          <div className="space-y-2">
            <input
              type="text"
              disabled
              className="shadow-rosa/50 focus:shadow-rosa w-full h-[40px] rounded-md px-4 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px] bg-gray-100"
              placeholder="Nome do Terapeuta"
              value={pacienteSelecionado?.terapeutaInfo.nomeTerapeuta || ''}
            />
          </div>
          <h3 className="font-medium text-azul text-xl mb-4">
            Dados do Agendamento
          </h3>
          <div className="space-y-6">
            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  className="text-sm text-slate-500"
                  htmlFor="dataAgendamento"
                >
                  Data do Agendamento
                </label>
                <Controller
                  control={control}
                  name="dataAgendamento"
                  render={({ field }) => (
                    <Popover modal={true}>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          id="dataAgendamento"
                          ref={calendarTriggerRef}
                          className={cn(
                            'shadow-rosa/50 focus:shadow-rosa w-full h-[40px] rounded-md px-4 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px] text-left flex items-center',
                            !field.value && 'text-slate-400',
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value
                            ? format(field.value, 'dd/MM/yyyy')
                            : 'Selecione uma data'}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date)
                            calendarTriggerRef.current?.click()
                            calendarTriggerRef.current?.focus()
                          }}
                          initialFocus
                          locale={ptBR}
                          classNames={{
                            day_selected: 'bg-rosa text-white',
                            month: 'capitalize',
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                {errors.dataAgendamento && (
                  <span className="text-red-500 text-sm">
                    {errors.dataAgendamento.message}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <label
                  className="text-sm text-slate-500"
                  htmlFor="horarioAgendamento"
                >
                  Horário
                </label>
                <input
                  type="text"
                  maxLength={5}
                  placeholder="hh:mm"
                  {...register('horarioAgendamento', {
                    onChange: (e) => {
                      const masked = maskTime(e.target.value)
                      e.target.value = masked
                    },
                  })}
                  className="shadow-rosa/50 focus:shadow-rosa w-full h-[40px] rounded-md px-4 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                />
                {errors.horarioAgendamento && (
                  <span className="text-red-500 text-sm">
                    {errors.horarioAgendamento.message}
                  </span>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label
                className="text-sm text-slate-500"
                htmlFor="localAgendamento"
              >
                Local do Agendamento
              </Label>
              <Controller
                control={control}
                name="localAgendamento"
                render={({ field }) => (
                  <RadioGroup.Root
                    className="flex items-center gap-x-6"
                    value={field.value || ''}
                    onValueChange={(value) => {
                      field.onChange(value)
                      handleFocus()
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroup.Item
                        value="Sala Verde"
                        className="w-[20px] h-[20px] border border-rosa rounded-full flex items-center justify-center"
                        id="sala-verde"
                      >
                        <RadioGroup.Indicator className="w-[10px] h-[10px] bg-green-600 rounded-full" />
                      </RadioGroup.Item>
                      <label
                        className="text-black text-[17px] leading-none"
                        htmlFor="sala-verde"
                      >
                        Sala Verde
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroup.Item
                        value="Sala Azul"
                        className="w-[20px] h-[20px] border border-rosa rounded-full flex items-center justify-center"
                        id="sala-azul"
                      >
                        <RadioGroup.Indicator className="w-[10px] h-[10px] bg-blue-500 rounded-full" />
                      </RadioGroup.Item>
                      <label
                        className="text-black text-[17px] leading-none"
                        htmlFor="sala-azul"
                      >
                        Sala Azul
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroup.Item
                        value="Não Precisa de Sala"
                        className="w-[20px] h-[20px] border border-rosa rounded-full flex items-center justify-center"
                        id="nao-precisa-sala"
                      >
                        <RadioGroup.Indicator className="w-[10px] h-[10px] bg-yellow-500 rounded-full" />
                      </RadioGroup.Item>
                      <label
                        className="text-black text-[17px] leading-none"
                        htmlFor="nao-precisa-sala"
                      >
                        Não Precisa de Sala
                      </label>
                    </div>
                  </RadioGroup.Root>
                )}
              />
              {errors.localAgendamento && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.localAgendamento.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label
                htmlFor="modalidadeAgendamento"
                className="text-sm text-slate-500"
              >
                Modalidade
              </label>
              <Controller
                control={control}
                name="modalidadeAgendamento"
                render={({ field }) => (
                  <RadioGroup.Root
                    id="modalidadeAgendamento"
                    value={field.value || ''}
                    onValueChange={(value) => {
                      field.onChange(value)
                      handleFocus()
                    }}
                    className="flex items-center gap-x-6"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroup.Item
                        value="Presencial"
                        className="w-[20px] h-[20px] border border-rosa rounded-full flex items-center justify-center"
                        id="presencial"
                      >
                        <RadioGroup.Indicator className="w-[10px] h-[10px] bg-rosa rounded-full" />
                      </RadioGroup.Item>
                      <label
                        className="text-black text-[17px] leading-none"
                        htmlFor="presencial"
                      >
                        Presencial
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroup.Item
                        value="Online"
                        className="w-[20px] h-[20px] border border-rosa rounded-full flex items-center justify-center"
                        id="online"
                      >
                        <RadioGroup.Indicator className="w-[10px] h-[10px] bg-rosa rounded-full" />
                      </RadioGroup.Item>
                      <label
                        className="text-black text-[17px] leading-none"
                        htmlFor="online"
                      >
                        Online
                      </label>
                    </div>
                  </RadioGroup.Root>
                )}
              />
              {errors.modalidadeAgendamento && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.modalidadeAgendamento.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label
                className="text-sm text-slate-500"
                htmlFor="tipoAgendamento"
              >
                Tipo de Agendamento
              </label>
              <Controller
                control={control}
                name="tipoAgendamento"
                render={({ field: { onChange, value } }) => (
                  <Select
                    value={value}
                    onValueChange={(val) => {
                      onChange(val)
                      handleFocus()
                    }}
                  >
                    <SelectTrigger className="shadow-rosa/50 focus:shadow-rosa w-full h-[40px] rounded-md px-4 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]">
                      <SelectValue placeholder="Selecione o tipo de agendamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sessão">Sessão</SelectItem>
                      <SelectItem value="Orientação Parental">
                        Orientação Parental
                      </SelectItem>
                      <SelectItem value="Visita Escolar">
                        Visita Escolar
                      </SelectItem>
                      <SelectItem value="Supervisão">Supervisão</SelectItem>
                      <SelectItem value="Outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            {errors.tipoAgendamento && (
              <p className="text-red-500 text-sm">
                {errors.tipoAgendamento.message}
              </p>
            )}
            <div className="space-y-2">
              <label
                className="text-sm text-slate-500"
                htmlFor="statusAgendamento"
              >
                Status do Agendamento
              </label>
              <Controller
                control={control}
                name="statusAgendamento"
                render={({ field: { onChange, value } }) => (
                  <RadioGroup.Root
                    id="statusAgendamento"
                    className="flex items-center gap-x-6"
                    value={value || ''}
                    onValueChange={(val) => {
                      onChange(val)
                      handleFocus()
                    }}
                  >
                    {/* Confirmado */}
                    <div className="flex items-center gap-2">
                      <RadioGroup.Item
                        value="Confirmado"
                        className="w-[20px] h-[20px] border border-rosa rounded-full flex items-center justify-center"
                        id="confirmado"
                      >
                        <RadioGroup.Indicator className="w-[10px] h-[10px] bg-green-600 rounded-full" />
                      </RadioGroup.Item>
                      <label
                        className="text-black text-[17px] leading-none"
                        htmlFor="confirmado"
                      >
                        Confirmado
                      </label>
                    </div>

                    {/* Remarcado */}
                    <div className="flex items-center gap-2">
                      <RadioGroup.Item
                        value="Remarcado"
                        className="w-[20px] h-[20px] border border-rosa rounded-full flex items-center justify-center"
                        id="remarcado"
                      >
                        <RadioGroup.Indicator className="w-[10px] h-[10px] bg-yellow-500 rounded-full" />
                      </RadioGroup.Item>
                      <label
                        className="text-black text-[17px] leading-none"
                        htmlFor="remarcado"
                      >
                        Remarcado
                      </label>
                    </div>

                    {/* Cancelado */}
                    <div className="flex items-center gap-2">
                      <RadioGroup.Item
                        value="Cancelado"
                        className="w-[20px] h-[20px] border border-rosa rounded-full flex items-center justify-center"
                        id="cancelado"
                      >
                        <RadioGroup.Indicator className="w-[10px] h-[10px] bg-red-500 rounded-full" />
                      </RadioGroup.Item>
                      <label
                        className="text-black text-[17px] leading-none"
                        htmlFor="cancelado"
                      >
                        Cancelado
                      </label>
                    </div>
                  </RadioGroup.Root>
                )}
              />
              {errors.statusAgendamento && (
                <p className="text-red-500 text-sm">
                  {errors.statusAgendamento.message}
                </p>
              )}
            </div>
            {errors.statusAgendamento && (
              <p className="text-red-500 text-sm">
                {errors.statusAgendamento.message}
              </p>
            )}
            <div className="space-y-2">
              <label
                className="text-sm text-slate-500"
                htmlFor="observacoesAgendamento"
              >
                Observações
              </label>
              <textarea
                {...register('observacoesAgendamento')}
                id="observacoesAgendamento"
                className="shadow-rosa/50 focus:shadow-rosa w-full min-h-[80px] rounded-md px-4 py-2 text-[15px] leading-normal shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                placeholder="Observações do agendamento"
              />
            </div>
          </div>

          {mensagemAlerta && (
            <p className="text-yellow-950 text-sm mt-4 bg-orange-100 text-center p-2">
              {mensagemAlerta}
            </p>
          )}

          {conflito && (
            <p className="text-red-800 text-sm mt-4 bg-red-100 text-center p-2">
              {mensagemConflito}
            </p>
          )}
          <button
            type="submit"
            disabled={isButtonDisabled}
            className={`w-full bg-rosa hover:bg-rosa/90 text-white font-medium py-2 px-4 rounded-md transition-colors ${
              isButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </button>
          {mensagemSucesso && (
            <p className="text-green-500 text-sm mt-4">{mensagemSucesso}</p>
          )}

          {mensagemErro && (
            <p className="text-red-500 text-sm mt-4">{mensagemErro}</p>
          )}
        </form>
      </DialogContent>
    </DialogPortal>
  )
}
