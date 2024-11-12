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
// import { updateAgendamento } from '@/store/agendamentosSlice'
import type { Agendamento } from '@/tipos'
import { updateAgendamento } from '@/store/agendamentosSlice'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { DialogPortal } from '@radix-ui/react-dialog'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { cn } from '@/lib/utils'
import { CalendarIcon } from '@radix-ui/react-icons'
import { format } from 'date-fns'
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

const EditarAgendaFormSchema = z.object({
  id: z.string(),
  pacienteId: z.string().min(1, 'Selecione um paciente'),
  dataAgendamento: z.date({
    required_error: 'Selecione uma data',
    invalid_type_error: 'Selecione uma data válida',
  }),
  horarioAgendamento: z.string().min(1, 'Selecione um horário'),
  localAgendamento: z.enum(['Sala Verde', 'Sala Azul', 'Não Precisa de Sala']),
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
})

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
    const agendamento = agendamentos.find((a) => a.id === agendamentoId)
    if (agendamento) {
      reset({
        id: agendamento.id,
        pacienteId: agendamento.pacienteInfo.id,
        dataAgendamento: new Date(agendamento.dataAgendamento),
        horarioAgendamento: agendamento.horarioAgendamento,
        localAgendamento: agendamento.localAgendamento,
        modalidadeAgendamento: agendamento.modalidadeAgendamento,
        tipoAgendamento: agendamento.tipoAgendamento,
        statusAgendamento: agendamento.statusAgendamento,
        observacoesAgendamento: agendamento.observacoesAgendamento,
      })
    }
  }, [agendamentoId, agendamentos, reset])

  async function handleEditAgendamento(data: EditarAgendaFormInputs) {
    try {
      // Simula um atraso de 2 segundos
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const pacienteSelecionado = pacientes.find(
        (p) => p.id === data.pacienteId,
      )
      if (!pacienteSelecionado) {
        throw new Error('Paciente não encontrado')
      }

      const agendamentoAtualizado: Agendamento = {
        id: data.id,
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
      reset()
      toast.info('Agendamento atualizado com sucesso!')
      console.log('Agendamento atualizado:', data)
      onClose()
    } catch (error) {
      toast.error('Erro ao editar agendamento. Tente novamente.')
      console.error('Erro ao editar agendamento:', error)
    }
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
              disabled={isSubmitting}
              className="bg-rosa w-full hover:bg-rosa/90 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              <span>{isSubmitting ? 'Salvando...' : 'Editar'}</span>
            </button>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
