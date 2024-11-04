import { fetchAgendamentos } from '@/store/agendamentosSlice'
import type { RootState, AppDispatch } from '@/store/store'
import {
  Calendar,
  CaretLeft,
  CaretRight,
  Plus,
  User,
} from '@phosphor-icons/react'
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  subMonths,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useEffect, useMemo, useState } from 'react'
import DatePicker from 'react-datepicker'
import { useDispatch, useSelector } from 'react-redux'

// TODO: fetch dos dias da semana do mês atual
// TODO: fetch dos agendamentos do terapeuta selecionado
// TODO: Preencher os dias do mês com os agendamentos

export function Agendas() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedTerapeuta, setSelectedTerapeuta] = useState('Todos')
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

  // Filter appointments by selected therapist and date
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

      return isSameMonthFilter && isSameTerapeuta
    })
  }, [agendamentos, selectedDate, selectedTerapeuta])

  // Get all days of current month
  const getDaysInMonth = (date: Date) => {
    const start = startOfMonth(date)
    const end = endOfMonth(date)
    return eachDayOfInterval({ start, end })
  }

  const days = getDaysInMonth(selectedDate)

  const handlePreviousMonth = () => {
    setSelectedDate(subMonths(selectedDate, 1))
  }

  const handleNextMonth = () => {
    setSelectedDate(addMonths(selectedDate, 1))
  }

  useEffect(() => {
    dispatch(fetchAgendamentos())
  }, [dispatch])

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 bg-gray-100 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Terapeutas</h1>
          <button
            type="button"
            className="flex items-center bg-azul text-white px-4 py-2 rounded hover:bg-sky-600"
          >
            <Plus size={20} weight="bold" className="mr-2" />
            Nova Agenda
          </button>
        </div>
        {/* Filters and Summary */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-8">
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
              {format(selectedDate, 'MMMM yyyy', { locale: ptBR })}
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
        <div className="bg-white rounded shadow">
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
              <div key={day} className="p-4 text-center font-semibold">
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

              return (
                <div
                  key={day.toISOString()}
                  className="min-h-[120px] p-2 bg-white"
                >
                  <div className="font-semibold mb-1">{format(day, 'd')}</div>
                  <div className="space-y-1">
                    {dayAgendamentos.map((agendamento) => (
                      <div
                        key={agendamento.id}
                        className={`text-xs p-1 rounded ${
                          agendamento.localAgendamento === 'Sala Verde'
                            ? 'bg-green-100 text-green-800'
                            : agendamento.localAgendamento === 'Sala Azul'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        <div>{agendamento.horarioAgendamento}</div>
                        <div className="font-semibold">
                          {agendamento.pacienteInfo.terapeutaInfo.nomeTerapeuta}{' '}
                          - {agendamento.pacienteInfo.nomePaciente}
                        </div>
                        <div className="italic">
                          {agendamento.localAgendamento} -{' '}
                          {agendamento.tipoAgendamento}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
