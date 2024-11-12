import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from '@/components/ui/dialog'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '@/store/store'
import { useEffect, useMemo, useRef } from 'react'
import type { Agendamento } from '@/tipos'
import {
  addAgendamento,
  deleteAgendamento,
  updateAgendamento,
} from '@/store/agendamentosSlice'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { DialogPortal } from '@radix-ui/react-dialog'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { cn } from '@/lib/utils'
import { CalendarIcon } from '@radix-ui/react-icons'
import { addWeeks, differenceInWeeks, format, isBefore, setDay } from 'date-fns'
import { Calendar } from '../ui/calendar'
import { ptBR } from 'date-fns/locale'
import { Label } from '../ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import * as RadioGroup from '@radix-ui/react-radio-group'
import { maskTime } from '@/utils/formatter'
import { toast } from 'sonner'
import { Checkbox } from '../ui/checkbox'
import { v4 as uuidv4 } from 'uuid'

const EditarAgendaFormSchema = z
  .object({
    id: z.string(),
    pacienteId: z.string().min(1, 'Selecione um paciente'),
    dataAgendamento: z.date({
      required_error: 'Selecione uma data',
      invalid_type_error: 'Selecione uma data válida',
    }),
    horarioAgendamento: z.string().min(1, 'Selecione um horário'),
    localAgendamento: z.enum([
      'Sala Verde',
      'Sala Azul',
      'Não Precisa de Sala',
    ]),
    modalidadeAgendamento: z.enum(['Presencial', 'Online']),
    tipoAgendamento: z.enum([
      'Sessão',
      'Orientação Parental',
      'Visita Escolar',
      'Reunião Escolar',
      'Supervisão',
      'Outros',
    ]),
    statusAgendamento: z.enum(['Confirmado', 'Remarcado', 'Cancelado']),
    observacoesAgendamento: z.string().optional(),
    periodicidade: z.enum(['Não repetir', 'Semanal', 'Quinzenal']),
    diasDaSemana: z
      .array(
        z.enum([
          'Domingo',
          'Segunda-feira',
          'Terça-feira',
          'Quarta-feira',
          'Quinta-feira',
          'Sexta-feira',
          'Sábado',
        ]),
      )
      .optional(),
    dataFimRecorrencia: z.date().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      (data.periodicidade === 'Semanal' ||
        data.periodicidade === 'Quinzenal') &&
      !data.dataFimRecorrencia
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Data fim é obrigatória para agendamentos recorrentes',
        path: ['dataFimRecorrencia'],
      })
    }
  })

type AgendamentoOperation = Agendamento | string

type EditarAgendaFormInputs = z.infer<typeof EditarAgendaFormSchema>

interface EditarAgendaModalProps {
  agendamentoId: string
  open: boolean
  onClose: () => void
}

export function EditarAgendaModal({
  agendamentoId,
  open,
  onClose,
}: EditarAgendaModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<EditarAgendaFormInputs>({
    resolver: zodResolver(EditarAgendaFormSchema),
    defaultValues: {
      id: '',
      pacienteId: '',
      dataAgendamento: undefined,
      horarioAgendamento: '',
      localAgendamento: undefined,
      modalidadeAgendamento: undefined,
      tipoAgendamento: undefined,
      statusAgendamento: undefined,
      observacoesAgendamento: '',
      periodicidade: 'Não repetir',
      diasDaSemana: [],
      dataFimRecorrencia: undefined,
    },
  })
  const dispatch = useDispatch<AppDispatch>()
  const agendamentos = useSelector(
    (state: RootState) => state.agendamentos.data,
  )
  const pacientes = useSelector((state: RootState) => state.pacientes.data)
  const pacienteId = watch('pacienteId')
  const pacienteSelecionado = useMemo(
    () => pacientes.find((paciente) => paciente.id === pacienteId),
    [pacienteId, pacientes],
  )

  const calendarTriggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const currentAgendamento = agendamentos.find((a) => a.id === agendamentoId)
    if (currentAgendamento) {
      // Find all related appointments if it has recurrenceId
      const isRecurrent = currentAgendamento.recurrenceId
      let periodicidade: 'Não repetir' | 'Semanal' | 'Quinzenal' = 'Não repetir'
      let diasDaSemana: Array<
        | 'Domingo'
        | 'Segunda-feira'
        | 'Terça-feira'
        | 'Quarta-feira'
        | 'Quinta-feira'
        | 'Sexta-feira'
        | 'Sábado'
      > = []
      let dataFimRecorrencia: Date | undefined

      if (isRecurrent) {
        // Get all appointments with same recurrenceId
        const recurrentAgendamentos = agendamentos.filter(
          (a) => a.recurrenceId === currentAgendamento.recurrenceId,
        )

        // Sort by date to get the last one
        const sortedAgendamentos = recurrentAgendamentos.sort(
          (a, b) =>
            new Date(b.dataAgendamento).getTime() -
            new Date(a.dataAgendamento).getTime(),
        )

        // Get unique days of week
        diasDaSemana = recurrentAgendamentos
          .map((a) => {
            const dayName = format(new Date(a.dataAgendamento), 'cccc', {
              locale: ptBR,
            })
            // Capitalize first letter and map to correct day name
            switch (dayName) {
              case 'domingo':
                return 'Domingo'
              case 'segunda-feira':
                return 'Segunda-feira'
              case 'terça-feira':
                return 'Terça-feira'
              case 'quarta-feira':
                return 'Quarta-feira'
              case 'quinta-feira':
                return 'Quinta-feira'
              case 'sexta-feira':
                return 'Sexta-feira'
              case 'sábado':
                return 'Sábado'
              default:
                return undefined
            }
          })
          .filter(
            (day): day is (typeof diasDaSemana)[number] => day !== undefined,
          )
          .filter((day, index, self) => self.indexOf(day) === index)

        // Last appointment date is the end date
        dataFimRecorrencia = new Date(sortedAgendamentos[0].dataAgendamento)

        // Determine periodicity based on dates
        const firstDate = new Date(
          sortedAgendamentos[sortedAgendamentos.length - 1].dataAgendamento,
        )
        const secondDate = new Date(
          sortedAgendamentos[sortedAgendamentos.length - 2].dataAgendamento,
        )
        const weeksDiff = differenceInWeeks(secondDate, firstDate)
        periodicidade = weeksDiff === 1 ? 'Semanal' : 'Quinzenal'
      }

      reset({
        id: currentAgendamento.id,
        pacienteId: currentAgendamento.pacienteInfo.id,
        dataAgendamento: new Date(currentAgendamento.dataAgendamento),
        horarioAgendamento: currentAgendamento.horarioAgendamento,
        localAgendamento: currentAgendamento.localAgendamento,
        modalidadeAgendamento: currentAgendamento.modalidadeAgendamento,
        tipoAgendamento: currentAgendamento.tipoAgendamento,
        statusAgendamento: currentAgendamento.statusAgendamento,
        observacoesAgendamento: currentAgendamento.observacoesAgendamento,
        periodicidade,
        diasDaSemana,
        dataFimRecorrencia,
      })
    }
  }, [agendamentoId, agendamentos, reset])

  async function handleEditAgendamento(data: EditarAgendaFormInputs) {
    try {
      // Agrupa todas as operações assíncronas que serão executadas
      const operations: Promise<AgendamentoOperation>[] = []

      const pacienteSelecionado = pacientes.find(
        (p) => p.id === data.pacienteId,
      )
      if (!pacienteSelecionado) throw new Error('Paciente não encontrado')

      const currentAgendamento = agendamentos.find((a) => a.id === data.id)
      if (!currentAgendamento) throw new Error('Agendamento não encontrado')

      if (data.periodicidade !== 'Não repetir') {
        const recurrentAgendamentos = currentAgendamento.recurrenceId
          ? agendamentos.filter(
              (a) => a.recurrenceId === currentAgendamento.recurrenceId,
            )
          : [currentAgendamento]

        const recurrenceId = currentAgendamento.recurrenceId || uuidv4()
        const updatedAgendamentos: Agendamento[] = []
        let currentDate = data.dataAgendamento

        const existingAgendamentosByDate = new Map(
          recurrentAgendamentos.map((a) => [
            format(new Date(a.dataAgendamento), 'yyyy-MM-dd'),
            a,
          ]),
        )

        while (currentDate <= data.dataFimRecorrencia!) {
          for (const diaSemana of data.diasDaSemana || []) {
            const nextDate = getNextDate(
              currentDate,
              diaSemana,
              data.periodicidade,
            )
            if (nextDate > data.dataFimRecorrencia!) continue

            const dateKey = format(nextDate, 'yyyy-MM-dd')
            const existingAgendamento = existingAgendamentosByDate.get(dateKey)

            const agendamentoToUpdate: Agendamento = {
              id: existingAgendamento?.id || uuidv4(),
              recurrenceId,
              terapeutaInfo: pacienteSelecionado.terapeutaInfo,
              pacienteInfo: pacienteSelecionado,
              dataAgendamento: nextDate,
              horarioAgendamento: data.horarioAgendamento,
              localAgendamento: data.localAgendamento,
              modalidadeAgendamento: data.modalidadeAgendamento,
              tipoAgendamento: data.tipoAgendamento,
              statusAgendamento: data.statusAgendamento,
              observacoesAgendamento: data.observacoesAgendamento || '',
            }

            // Adiciona as operações ao array de promises
            if (existingAgendamento) {
              operations.push(
                dispatch(updateAgendamento(agendamentoToUpdate)).unwrap(),
              )
            } else {
              operations.push(
                dispatch(addAgendamento(agendamentoToUpdate)).unwrap(),
              )
            }

            updatedAgendamentos.push(agendamentoToUpdate)
          }

          currentDate =
            data.periodicidade === 'Semanal'
              ? addWeeks(currentDate, 1)
              : addWeeks(currentDate, 2)
        }

        const oldAgendamentosToDelete = recurrentAgendamentos.filter(
          (old) =>
            !updatedAgendamentos.some((updated) => updated.id === old.id),
        )

        // Adiciona as operações de delete ao array de promises
        for (const agendamento of oldAgendamentosToDelete) {
          operations.push(dispatch(deleteAgendamento(agendamento.id)).unwrap())
        }

        // Aguarda todas as operações serem concluídas
        await Promise.all(operations)
      } else {
        const agendamentoAtualizado: Agendamento = {
          ...currentAgendamento,
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

        await dispatch(updateAgendamento(agendamentoAtualizado)).unwrap()
      }

      toast.success('Agendamento atualizado com sucesso!')
      onClose()
    } catch (error) {
      console.error('Erro completo:', error)
      toast.error('Erro ao editar agendamento')
    }
  }

  // Função auxiliar para obter a próxima data
  function getNextDate(
    baseDate: Date,
    diaSemana: string,
    periodicidade: string,
  ): Date {
    const dayMap: { [key: string]: number } = {
      Domingo: 0,
      'Segunda-feira': 1,
      'Terça-feira': 2,
      'Quarta-feira': 3,
      'Quinta-feira': 4,
      'Sexta-feira': 5,
      Sábado: 6,
    }

    const targetDay = dayMap[diaSemana]
    let proximaData = setDay(baseDate, targetDay, { weekStartsOn: 0 })

    if (isBefore(proximaData, baseDate)) {
      proximaData = setDay(proximaData, targetDay, { weekStartsOn: 0 })
      proximaData = addWeeks(proximaData, periodicidade === 'Quinzenal' ? 2 : 1)
    }

    return proximaData
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay className="bg-gray-500/25 data-[state=open]:animate-overlayShow fixed inset-0" />
        <DialogContent className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] w-[90vw] max-w-[1024px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-azul">
              Editar Agendamento
            </DialogTitle>
            <DialogDescription>
              <VisuallyHidden>Cadastrar Novo Agendamento</VisuallyHidden>
            </DialogDescription>
            <button
              type="button"
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-700"
              onClick={onClose}
            />
          </DialogHeader>

          <form
            onSubmit={handleSubmit(handleEditAgendamento)}
            className="space-y-4"
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
                    value={value}
                    onValueChange={(val) => {
                      onChange(val)
                    }}
                  >
                    <SelectTrigger className="shadow-rosa/50 focus:shadow-rosa w-full h-[40px] rounded-md px-4">
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
                  render={({ field: { onChange, value } }) => (
                    <RadioGroup.Root
                      className="flex items-center gap-x-6"
                      value={value}
                      onValueChange={(val) => {
                        onChange(val)
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
              {/* Periodicidade */}
              <div className="space-y-2">
                <label
                  className="text-sm text-slate-500"
                  htmlFor="periodicidade"
                >
                  Periodicidade
                </label>
                <Controller
                  control={control}
                  name="periodicidade"
                  render={({ field: { onChange, value } }) => (
                    <Select
                      value={value || 'Não repetir'}
                      onValueChange={onChange}
                    >
                      <SelectTrigger className="shadow-rosa/50 focus:shadow-rosa w-full h-[40px] rounded-md px-4">
                        <SelectValue placeholder="Selecione a periodicidade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Não repetir">Não repetir</SelectItem>
                        <SelectItem value="Semanal">Semanal</SelectItem>
                        <SelectItem value="Quinzenal">Quinzenal</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              {/* Dias da Semana */}
              {(watch('periodicidade') === 'Semanal' ||
                watch('periodicidade') === 'Quinzenal') && (
                <div className="space-y-2">
                  <label
                    htmlFor="diasDaSemana"
                    className="text-sm text-slate-500"
                  >
                    Dias da Semana
                  </label>
                  <Controller
                    control={control}
                    name="diasDaSemana"
                    render={({ field: { onChange, value } }) => (
                      <div className="flex flex-wrap gap-2">
                        {[
                          'Domingo',
                          'Segunda-feira',
                          'Terça-feira',
                          'Quarta-feira',
                          'Quinta-feira',
                          'Sexta-feira',
                          'Sábado',
                        ].map((dia) => (
                          <label
                            key={dia}
                            className="flex items-center space-x-2"
                            htmlFor={dia}
                          >
                            <Checkbox
                              id={dia}
                              checked={value?.includes(
                                dia as
                                  | 'Domingo'
                                  | 'Segunda-feira'
                                  | 'Terça-feira'
                                  | 'Quarta-feira'
                                  | 'Quinta-feira'
                                  | 'Sexta-feira'
                                  | 'Sábado',
                              )}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  onChange([...(value || []), dia])
                                } else {
                                  onChange(
                                    (value || []).filter((d) => d !== dia),
                                  )
                                }
                              }}
                              className="w-4 h-4 border rounded data-[state=checked]:bg-rosa data-[state=checked]:border-rosa"
                            />
                            <span>{dia}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  />
                </div>
              )}
              {/* Data Fim Recorrência */}
              {(watch('periodicidade') === 'Semanal' ||
                watch('periodicidade') === 'Quinzenal') && (
                <div className="space-y-2">
                  <label
                    className="text-sm text-slate-500"
                    htmlFor="dataFimRecorrencia"
                  >
                    Data de fim da Recorrência
                  </label>
                  <Controller
                    control={control}
                    name="dataFimRecorrencia"
                    render={({ field }) => (
                      <Popover modal={true}>
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            id="dataFimRecorrencia"
                            ref={calendarTriggerRef}
                            className={cn(
                              'shadow-rosa/50 focus:shadow-rosa w-full h-[40px] rounded-md px-4 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px] text-left flex items-center',
                              !field.value && 'text-slate-400',
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value
                              ? format(field.value, 'dd/MM/yyyy')
                              : 'Selecione uma data fim da recorrência'}
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
                  {errors.dataFimRecorrencia && (
                    <span className="text-red-500 text-sm">
                      {errors.dataFimRecorrencia.message}
                    </span>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <label
                  className="text-sm text-slate-500"
                  htmlFor="modalidadeAgendamento"
                >
                  Modalidade do Agendamento
                </label>
                <Controller
                  control={control}
                  name="modalidadeAgendamento"
                  render={({ field: { onChange, value } }) => (
                    <RadioGroup.Root
                      value={value}
                      onValueChange={(val) => {
                        onChange(val)
                      }}
                      className="flex items-center gap-x-6"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroup.Item
                          value="Presencial"
                          id="presencial"
                          className="w-[20px] h-[20px] border border-rosa rounded-full flex items-center justify-center"
                        >
                          <RadioGroup.Indicator className="w-[10px] h-[10px] bg-rosa rounded-full" />
                        </RadioGroup.Item>
                        <label htmlFor="presencial">Presencial</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroup.Item
                          value="Online"
                          id="online"
                          className="w-[20px] h-[20px] border border-rosa rounded-full flex items-center justify-center"
                        >
                          <RadioGroup.Indicator className="w-[10px] h-[10px] bg-rosa rounded-full" />
                        </RadioGroup.Item>
                        <label htmlFor="online">Online</label>
                      </div>
                    </RadioGroup.Root>
                  )}
                />
                {errors.modalidadeAgendamento && (
                  <p className="text-red-500 text-sm">
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
                      }}
                    >
                      <SelectTrigger className="shadow-rosa/50 focus:shadow-rosa w-full h-[40px] rounded-md px-4">
                        <SelectValue placeholder="Selecione o tipo" />
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
                {errors.tipoAgendamento && (
                  <p className="text-red-500 text-sm">
                    {errors.tipoAgendamento.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label
                  className="text-sm text-slate-500"
                  htmlFor="statusAgendamento"
                >
                  Status
                </label>
                <Controller
                  control={control}
                  name="statusAgendamento"
                  render={({ field: { onChange, value } }) => (
                    <RadioGroup.Root
                      id="statusAgendamento"
                      value={value}
                      onValueChange={(val) => {
                        onChange(val)
                      }}
                      className="flex items-center gap-x-6"
                    >
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

            <button
              type="submit"
              disabled={isSubmitting || Object.keys(errors).length > 0}
              className={`w-full bg-rosa hover:bg-rosa/90 text-white font-medium py-2 px-4 rounded-md transition-colors ${
                isSubmitting || Object.keys(errors).length > 0
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
            >
              {isSubmitting ? 'Editando...' : 'Editar'}
            </button>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
