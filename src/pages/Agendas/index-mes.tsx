import { fetchAgendamentos } from '@/store/agendamentosSlice'
import type { RootState, AppDispatch } from '@/store/store'
import {
  Calendar,
  CaretLeft,
  CaretRight,
  Door,
  Plus,
  User,
} from '@phosphor-icons/react'
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useEffect, useMemo, useState } from 'react'
import DatePicker from 'react-datepicker'
import { useDispatch, useSelector } from 'react-redux'
import { NovaAgendaModal } from '@/components/Agenda/NovaAgendaModal'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'

export function Agendas() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedTerapeuta, setSelectedTerapeuta] = useState('Todos')
  const [chosedRoom, setChosedRoom] = useState({
    salaVerde: true,
    salaAzul: true,
  })
  const dispatch: AppDispatch = useDispatch()
  const agendamentos = useSelector(
    (state: RootState) => state.agendamentos.data,
  )

  // Get unique therapists that have appointments in selected month
  const availableTherapists = useMemo(() => {
    const therapists = agendamentos
      .filter((agendamento) =>
        isSameMonth(new Date(agendamento.dataAgendamento), selectedDate),
      )
      .map((agendamento) => ({
        id: agendamento.pacienteInfo.terapeutaInfo.id,
        nome: agendamento.pacienteInfo.terapeutaInfo.nomeTerapeuta,
      }))
      .filter(
        (terapeuta, index, self) =>
          index === self.findIndex((t) => t.id === terapeuta.id),
      )

    return [{ id: 'Todos', nome: 'Todos' }, ...therapists]
  }, [agendamentos, selectedDate])

  // Filter appointments by selected therapist, date and needs room
  const filteredAgendamentos = useMemo(() => {
    return agendamentos.filter((agendamento) => {
      const isSameMonthFilter = isSameMonth(
        new Date(agendamento.dataAgendamento),
        selectedDate,
      )
      const isSameTerapeuta =
        selectedTerapeuta === 'Todos' ||
        selectedTerapeuta ===
          agendamento.pacienteInfo.terapeutaInfo.nomeTerapeuta

      const isChosedRoom =
        (chosedRoom.salaVerde &&
          agendamento.localAgendamento === 'Sala Verde') ||
        (chosedRoom.salaAzul && agendamento.localAgendamento === 'Sala Azul')

      const needsRoom =
        agendamento.localAgendamento === 'Sala Verde' ||
        agendamento.localAgendamento === 'Sala Azul'

      return isSameMonthFilter && isSameTerapeuta && needsRoom && isChosedRoom
    })
  }, [agendamentos, selectedDate, selectedTerapeuta, chosedRoom])

  const filteredAgendamentosNoRoom = useMemo(() => {
    return agendamentos.filter((agendamento) => {
      const isSameMonthFilter = isSameMonth(
        new Date(agendamento.dataAgendamento),
        selectedDate,
      )
      const isSameTerapeuta =
        selectedTerapeuta === 'Todos' ||
        selectedTerapeuta ===
          agendamento.pacienteInfo.terapeutaInfo.nomeTerapeuta

      const isNoRoom = agendamento.localAgendamento === 'Não Precisa de Sala'

      return isSameMonthFilter && isSameTerapeuta && isNoRoom
    })
  }, [agendamentos, selectedDate, selectedTerapeuta])

  // Get all days of current month
  const getDaysInMonth = (date: Date) => {
    const start = startOfMonth(date)
    const end = endOfMonth(date)
    const days = eachDayOfInterval({ start, end })

    // Get the start of the week for the first day
    const firstDayOfMonth = startOfMonth(date)
    const startDate = startOfWeek(firstDayOfMonth)

    // Create array for padding days
    const paddingDays = []
    let currentDate = startDate

    // Add padding days before the first of month
    while (currentDate < firstDayOfMonth) {
      paddingDays.push(currentDate)
      currentDate = addDays(currentDate, 1)
    }

    return [...paddingDays, ...days]
  }

  const days = getDaysInMonth(selectedDate)

  // Handlers

  const handlePreviousMonth = () => {
    setSelectedDate(subMonths(selectedDate, 1))
  }

  const handleNextMonth = () => {
    setSelectedDate(addMonths(selectedDate, 1))
  }

  const handleRoomChange = (room: 'salaVerde' | 'salaAzul') => {
    setChosedRoom((prev) => ({
      ...prev,
      [room]: !prev[room],
    }))
  }

  useEffect(() => {
    dispatch(fetchAgendamentos())
  }, [dispatch])

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 bg-gray-100 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Agendas das Terapeutas</h1>
          <Dialog>
            <DialogTrigger asChild>
              <button
                type="button"
                className="flex items-center bg-azul text-white px-4 py-2 rounded hover:bg-sky-600"
              >
                <Plus size={20} weight="bold" className="mr-2" />
                Novo Agendamento
              </button>
            </DialogTrigger>
            <NovaAgendaModal />
          </Dialog>
        </div>
        {/* Filters and Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="flex items-center space-x-4 p-4 bg-white rounded shadow">
            <User size={24} />
            <label htmlFor="terapeutas" className="text-xl font-semibold">
              Terapeuta:
            </label>
            <select
              id="terapeutas"
              className="text-xl"
              value={selectedTerapeuta}
              onChange={(e) => setSelectedTerapeuta(e.target.value)}
            >
              {availableTherapists.map((terapeuta) => (
                <option key={terapeuta.id} value={terapeuta.nome}>
                  {terapeuta.nome}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-4 p-4 bg-white rounded shadow">
            <Door size={24} />
            <label htmlFor="localAgendamento" className="text-xl font-semibold">
              Sala:
            </label>
            <div className="flex items-center space-x-4 mt-1">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-azul"
                  checked={chosedRoom.salaVerde}
                  onChange={() => handleRoomChange('salaVerde')}
                />
                <span className="ml-2">Sala Verde</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-azul"
                  checked={chosedRoom.salaAzul}
                  onChange={() => handleRoomChange('salaAzul')}
                />
                <span className="ml-2">Sala Azul</span>
              </label>
            </div>
          </div>
        </div>
        {/* Date Navigation */}
        <div className="flex items-center justify-between p-4 bg-white rounded shadow mb-4">
          <button
            type="button"
            aria-label="Previous month"
            onClick={handlePreviousMonth}
          >
            <CaretLeft size={24} weight="fill" />
          </button>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-semibold">
              {format(selectedDate, 'MMMM yyyy', { locale: ptBR }).replace(
                /^\w/,
                (c) => c.toUpperCase(),
              )}
            </h2>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date || new Date())}
              showMonthYearPicker
              dateFormat="MMMM yyyy"
              locale={ptBR}
              customInput={
                <button type="button" aria-label="Selecione o mês e o ano">
                  <Calendar size={28} className="text-gray-500 mt-2" />
                </button>
              }
            />
          </div>
          <button
            type="button"
            aria-label="Next month"
            onClick={handleNextMonth}
          >
            <CaretRight size={24} weight="fill" />
          </button>
        </div>
        {/* Calendar Grid */}
        <div className="bg-white text-center">
          <h3 className="text-lg font-semibold p-2">
            Agendamentos que precisam de sala
          </h3>
        </div>
        <div className="bg-white rounded shadow">
          <div className="grid grid-cols-7 gap-px bg-rosa">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
              <div
                key={day}
                className="p-4 text-center font-semibold text-branco"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {days.map((day) => {
              const dayAgendamentos = filteredAgendamentos.filter(
                (agendamento) =>
                  isSameDay(new Date(agendamento.dataAgendamento), day),
              )
              const isCurrentMonth = isSameMonth(day, selectedDate)

              return (
                <div
                  key={day.toISOString()}
                  className={`min-h-[120px] p-2 ${
                    isCurrentMonth ? 'bg-white' : 'bg-gray-200'
                  }`}
                >
                  <div
                    className={`font-semibold mb-1 ${
                      !isCurrentMonth && 'text-gray-200'
                    }`}
                  >
                    {format(day, 'd')}
                  </div>
                  <div className="space-y-2">
                    {dayAgendamentos.map((agendamento) => (
                      <div
                        key={agendamento.id}
                        className={`text-xs p-1 space-y-1 rounded cursor-pointer transition-colors duration-200 group ${
                          agendamento.localAgendamento === 'Sala Verde'
                            ? 'bg-green-100 text-green-800 hover:bg-green-600'
                            : 'bg-blue-100 text-blue-800 hover:bg-blue-600'
                        }`}
                      >
                        <div className="font-semibold group-hover:text-white text-base">
                          {agendamento.horarioAgendamento} -{' '}
                          {agendamento.pacienteInfo.terapeutaInfo.nomeTerapeuta}
                        </div>
                        <div className="group-hover:text-white/90">
                          {agendamento.pacienteInfo.nomePaciente}
                        </div>
                        <div className="italic group-hover:text-white/70">
                          {agendamento.tipoAgendamento} -{' '}
                          {agendamento.modalidadeAgendamento}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div className="bg-white text-center">
          <h3 className="text-lg font-semibold mt-4 p-2">
            Agendamentos que não precisam de sala
          </h3>
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
          {filteredAgendamentosNoRoom.map((agendamento) => (
            <div
              key={agendamento.id}
              className="mt-4 p-4 rounded-lg bg-yellow-100 cursor-pointer transition-colors duration-200 group hover:bg-yellow-600 shadow-md"
            >
              <div className="mb-2">
                <div className="font-semibold text-slate-500 group-hover:text-white/90 text-sm">
                  {format(new Date(agendamento.dataAgendamento), 'dd/MM/yyyy')}{' '}
                  (
                  {format(new Date(agendamento.dataAgendamento), 'EEEE', {
                    locale: ptBR,
                  }).replace(/^\w/, (c) => c.toUpperCase())}
                  )
                </div>
              </div>

              <div className="space-y-1">
                <div className="font-medium text-slate-900 group-hover:text-white">
                  {agendamento.horarioAgendamento} -{' '}
                  {agendamento.pacienteInfo.terapeutaInfo.nomeTerapeuta}
                </div>

                <div className="text-slate-500 group-hover:text-white/90">
                  {agendamento.pacienteInfo.nomePaciente}
                </div>

                <div className="text-sm italic text-slate-500 group-hover:text-white/70">
                  {agendamento.tipoAgendamento} -{' '}
                  {agendamento.modalidadeAgendamento}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
