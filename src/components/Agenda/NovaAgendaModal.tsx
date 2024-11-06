import * as Dialog from '@radix-ui/react-dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { ptBR } from 'date-fns/locale'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { CalendarIcon } from '@radix-ui/react-icons'
import { Calendar } from '../ui/calendar'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { format } from 'date-fns'
import { Label } from '../ui/label'
import * as RadioGroup from '@radix-ui/react-radio-group'

export function NovaAgendaModal() {
  const [date, setDate] = useState<Date>()
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="bg-gray-500/25 data-[state=open]:animate-overlayShow fixed inset-0" />
      <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[768px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
        <Dialog.Title className="text-2xl font-bold text-azul mb-6">
          Novo Agendamento
        </Dialog.Title>
        <Dialog.Description>
          <VisuallyHidden>Cadastrar Novo Agendamento</VisuallyHidden>
        </Dialog.Description>
        <form
          // onSubmit={handleSubmit(handleCreateNewAgendamento)}
          className="space-y-6 bg-white rounded-lg"
        >
          <h3 className="font-medium text-azul text-xl mb-4">Paciente</h3>
          <div className="space-y-2">
            <select className="shadow-rosa/50 focus:shadow-rosa block w-full h-[40px] rounded-md px-4 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]">
              <option value="">Selecione o paciente</option>
              <option value="1">Paciente 1</option>
              <option value="2">Paciente 2</option>
            </select>
          </div>
          <h3 className="font-medium text-azul text-xl mb-4">Terapeuta</h3>
          <div className="space-y-2">
            <input
              type="text"
              disabled
              className="shadow-rosa/50 focus:shadow-rosa w-full h-[40px] rounded-md px-4 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px] bg-gray-100"
              placeholder="Nome do Terapeuta"
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
                <label className="text-sm text-slate-500">
                  Data do Agendamento
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
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
                      onSelect={setDate}
                      initialFocus
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-500">Horário</label>
                <input
                  type="text"
                  placeholder="00:00"
                  className="shadow-rosa/50 focus:shadow-rosa w-full h-[40px] rounded-md px-4 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label className="text-sm text-slate-500">
                Local do Agendamento
              </Label>
              <RadioGroup.Root className="flex items-center gap-x-6">
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
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-500">Modalidade</label>
              <RadioGroup.Root className="flex items-center gap-x-6">
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
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-500">
                Tipo de Agendamento
              </label>
              <select className="shadow-rosa/50 focus:shadow-rosa w-full h-[40px] rounded-md px-4 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]">
                <option value="">Selecione o tipo</option>
                <option value="Sessão">Sessão</option>
                <option value="Orientação Parental">Orientação Parental</option>
                <option value="Visita Escolar">Visita Escolar</option>
                <option value="Reunião Escolar">Reunião Escolar</option>
                <option value="Supervisão">Supervisão</option>
                <option value="Outros">Outros</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-500">Status</label>
              <RadioGroup.Root className="flex items-center gap-x-6">
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
            <div className="space-y-2">
              <label className="text-sm text-slate-500">Observações</label>
              <textarea
                className="shadow-rosa/50 focus:shadow-rosa w-full min-h-[80px] rounded-md px-4 py-2 text-[15px] leading-normal shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                placeholder="Observações do agendamento"
              />
            </div>
          </div>
          <button
            type="submit"
            // disabled={isButtonDisabled}
            className="w-full bg-rosa hover:bg-rosa/90 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            {/* {isSubmitting ? 'Salvando...' : 'Salvar'} */}
            Salvar
          </button>
        </form>
      </Dialog.Content>
    </Dialog.Portal>
  )
}
