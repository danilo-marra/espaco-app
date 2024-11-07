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
import { useForm } from 'react-hook-form'
import { fetchPacientes } from '@/store/pacientesSlice'
import { v4 as uuidv4 } from 'uuid'
import { addAgendamento } from '@/store/agendamentosSlice'

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
  observacoesAgendamento: z.string(),
})

type NovaAgendaFormInputs = z.infer<typeof NovaAgendaFormSchema>

// Função para formatar a máscara de hora
const maskTime = (value: string) => {
  // Remove all non-digits
  value = value.replace(/\D/g, '')

  // Format as HH:MM
  if (value.length >= 2) {
    const hours = value.slice(0, 2)
    const minutes = value.slice(2, 4)

    // Validate hours
    if (parseInt(hours) > 23) {
      value = '23' + value.slice(2)
    }

    // Validate minutes
    if (parseInt(minutes) > 59) {
      value = value.slice(0, 2) + '59'
    }

    return value.slice(0, 2) + (value.length > 2 ? ':' + value.slice(2, 4) : '')
  }

  return value
}

export function NovaAgendaModal() {
  const dispatch = useDispatch<AppDispatch>()
  const pacientes = useSelector((state: RootState) => state.pacientes.data)
  const [mensagemSucesso, setMensagemSucesso] = useState('')
  const [mensagemErro, setMensagemErro] = useState('')
  // const terapeutas = useSelector((state: RootState) => state.terapeutas.data)
  const [date, setDate] = useState<Date>()
  const calendarTriggerRef = useRef<HTMLButtonElement>(null)
  const [mensagemAlerta] = useState('')
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<NovaAgendaFormInputs>({
    resolver: zodResolver(NovaAgendaFormSchema),
  })
  const pacienteId = watch('pacienteId')
  const isButtonDisabled =
    isSubmitting || Object.keys(errors).length > 0 || mensagemAlerta !== ''
  const pacienteSelecionado = useMemo(
    () => pacientes.find((paciente) => paciente.id === pacienteId),
    [pacienteId, pacientes],
  )

  useEffect(() => {
    dispatch(fetchPacientes())
  }, [dispatch, errors])

  // Função pra evitar o erro de aria-hidden
  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    if (selectedDate) {
      setValue('dataAgendamento', selectedDate)
    }
    calendarTriggerRef.current?.click()
    calendarTriggerRef.current?.focus()
  }

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

      const novoAgendamento = {
        id: uuidv4(),
        terapeutaInfo: pacienteSelecionado.terapeutaInfo,
        pacienteInfo: pacienteSelecionado,
        dataAgendamento: data.dataAgendamento,
        horarioAgendamento: data.horarioAgendamento,
        localAgendamento: data.localAgendamento,
        modalidadeAgendamento: data.modalidadeAgendamento,
        tipoAgendamento: data.tipoAgendamento,
        statusAgendamento: data.statusAgendamento,
        observacoesAgendamento: data.observacoesAgendamento,
      }

      dispatch(addAgendamento(novoAgendamento)).unwrap()

      reset()
      setMensagemSucesso('Sessão criada com sucesso!')
      setMensagemErro('')
    } catch (error) {
      console.error('Erro ao criar nova sessão:', error)
      setMensagemErro('Erro ao criar sessão. Tente novamente.')
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
          <h3 className="font-medium text-azul text-xl mb-4">Paciente</h3>
          <div className="space-y-2">
            <select
              {...register('pacienteId')}
              onFocus={handleFocus}
              className="shadow-rosa/50 focus:shadow-rosa block w-full h-[40px] rounded-md px-4 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
            >
              <option value="">Selecione o paciente</option>
              {pacientes.map((paciente) => (
                <option key={paciente.id} value={paciente.id}>
                  {paciente.nomePaciente}
                </option>
              ))}
            </select>
            {errors.pacienteId && (
              <p className="text-red-500">{errors.pacienteId.message}</p>
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
          <div></div>
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

                <Popover modal={true}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      id="dataAgendamento"
                      ref={calendarTriggerRef}
                      className={cn(
                        'shadow-rosa/50 focus:shadow-rosa w-full h-[40px] rounded-md px-4 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px] text-left flex items-center',
                        !date && 'text-slate-400',
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, 'dd/MM/yyyy') : 'Selecione uma data'}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={handleDateSelect}
                      initialFocus
                      locale={ptBR}
                      classNames={{
                        day_selected: 'bg-rosa text-white',
                        month: 'capitalize',
                      }}
                    />
                  </PopoverContent>
                </Popover>
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
              <RadioGroup.Root
                className="flex items-center gap-x-6"
                onValueChange={(value) => {
                  setValue(
                    'localAgendamento',
                    value as NovaAgendaFormInputs['localAgendamento'],
                  )
                  handleFocus()
                }}
                {...register('localAgendamento')}
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
              {errors.localAgendamento && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.localAgendamento.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-500">Modalidade</label>
              <RadioGroup.Root
                onValueChange={(value) => {
                  setValue(
                    'modalidadeAgendamento',
                    value as NovaAgendaFormInputs['modalidadeAgendamento'],
                  )
                  handleFocus()
                }}
                {...register('modalidadeAgendamento')}
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
              <select
                className="shadow-rosa/50 focus:shadow-rosa w-full h-[40px] rounded-md px-4 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                id="tipoAgendamento"
                {...register('tipoAgendamento')}
              >
                <option value="">Selecione o tipo</option>
                <option value="Sessão">Sessão</option>
                <option value="Orientação Parental">Orientação Parental</option>
                <option value="Visita Escolar">Visita Escolar</option>
                <option value="Supervisão">Supervisão</option>
                <option value="Outros">Outros</option>
              </select>
            </div>
            {errors.tipoAgendamento && (
              <p className="text-red-500 text-sm">
                {errors.tipoAgendamento.message}
              </p>
            )}
            <div className="space-y-2">
              <label className="text-sm text-slate-500">Status</label>
              <RadioGroup.Root
                onValueChange={(value) => {
                  setValue(
                    'statusAgendamento',
                    value as NovaAgendaFormInputs['statusAgendamento'],
                  )
                  handleFocus()
                }}
                {...register('statusAgendamento')}
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
            disabled={isButtonDisabled}
            className={`w-full bg-rosa hover:bg-rosa/90 text-white font-medium py-2 px-4 rounded-md transition-colors ${
              isButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
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
      </DialogContent>
    </DialogPortal>
  )
}
