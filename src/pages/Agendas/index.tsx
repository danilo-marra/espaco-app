import { fetchAgendamentos } from '@/store/agendamentosSlice'
import type { RootState, AppDispatch } from '@/store/store'
import {
  CalendarCheck,
  CaretLeft,
  CaretRight,
  Door,
  Plus,
  User,
} from '@phosphor-icons/react'
import {
  addDays,
  addWeeks,
  format,
  isSameDay,
  isSameMonth,
  isSameWeek,
  startOfWeek,
  subWeeks,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NovaAgendaModal } from '@/components/Agenda/NovaAgendaModal'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import type { Agendamento } from '@/tipos'
import { useModal } from '@/hooks/useModal'
import { EditarAgendaModal } from '@/components/Agenda/EditarAgendaModal'

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

  const [selectedStatus, setSelectedStatus] = useState({
    confirmado: true,
    remarcado: true,
    cancelado: true,
  })

  const [agendaEditando, setAgendaEditando] = useState<Agendamento | null>(null)

  // Modal
  const { isEditModalOpen, openEditModal, closeEditModal } = useModal()

  // Ordenar agenda por horário
  const sortByTime = (a: Agendamento, b: Agendamento) => {
    return a.horarioAgendamento.localeCompare(b.horarioAgendamento)
  }

  // Obter o início da semana da data selecionada
  const startOfSelectedWeek = startOfWeek(selectedDate, { weekStartsOn: 0 })

  // Obter todos os dias da semana
  const daysOfWeek = Array.from({ length: 7 }).map((_, index) =>
    addDays(startOfSelectedWeek, index),
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
      const agendamentoDate = new Date(agendamento.dataAgendamento)
      const isInSelectedWeek = daysOfWeek.some((day) =>
        isSameDay(agendamentoDate, day),
      )
      // Aplicar outros filtros (terapeuta, sala, etc.)
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

      const isSelectedStatus =
        (selectedStatus.confirmado &&
          agendamento.statusAgendamento === 'Confirmado') ||
        (selectedStatus.remarcado &&
          agendamento.statusAgendamento === 'Remarcado') ||
        (selectedStatus.cancelado &&
          agendamento.statusAgendamento === 'Cancelado')

      return (
        isInSelectedWeek &&
        isSameTerapeuta &&
        needsRoom &&
        isChosedRoom &&
        isSelectedStatus
      )
    })
  }, [agendamentos, daysOfWeek, selectedTerapeuta, chosedRoom, selectedStatus])

  const filteredAgendamentosNoRoom = useMemo(() => {
    return agendamentos.filter((agendamento) => {
      const isSameWeekFilter = isSameWeek(
        new Date(agendamento.dataAgendamento),
        selectedDate,
      )
      const isSameTerapeuta =
        selectedTerapeuta === 'Todos' ||
        selectedTerapeuta ===
          agendamento.pacienteInfo.terapeutaInfo.nomeTerapeuta

      const isNoRoom = agendamento.localAgendamento === 'Não Precisa de Sala'

      const isSelectedStatus =
        (selectedStatus.confirmado &&
          agendamento.statusAgendamento === 'Confirmado') ||
        (selectedStatus.remarcado &&
          agendamento.statusAgendamento === 'Remarcado') ||
        (selectedStatus.cancelado &&
          agendamento.statusAgendamento === 'Cancelado')

      return isSameWeekFilter && isSameTerapeuta && isNoRoom && isSelectedStatus
    })
  }, [agendamentos, selectedDate, selectedTerapeuta, selectedStatus])

  // Handlers

  const handleRoomChange = (room: 'salaVerde' | 'salaAzul') => {
    setChosedRoom((prev) => ({
      ...prev,
      [room]: !prev[room],
    }))
  }

  const handleStatusChange = (
    status: 'confirmado' | 'remarcado' | 'cancelado',
  ) => {
    setSelectedStatus((prev) => ({
      ...prev,
      [status]: !prev[status],
    }))
  }

  const handleEditAgenda = (agenda: Agendamento) => {
    setAgendaEditando(agenda)
    openEditModal()
  }

  // Navegação entre semanas
  const handlePreviousWeek = () => {
    setSelectedDate(subWeeks(selectedDate, 1))
  }

  const handleNextWeek = () => {
    setSelectedDate(addWeeks(selectedDate, 1))
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
          <div className="flex items-center space-x-4 p-4 bg-white rounded shadow">
            <CalendarCheck size={24} />
            <label
              htmlFor="statusAgendamento"
              className="text-xl font-semibold"
            >
              Status:
            </label>
            <div className="flex items-center space-x-4 mt-1">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-green-500"
                  checked={selectedStatus.confirmado}
                  onChange={() => handleStatusChange('confirmado')}
                />
                <span className="ml-2">Confirmado</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-yellow-500"
                  checked={selectedStatus.remarcado}
                  onChange={() => handleStatusChange('remarcado')}
                />
                <span className="ml-2">Remarcado</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-red-500"
                  checked={selectedStatus.cancelado}
                  onChange={() => handleStatusChange('cancelado')}
                />
                <span className="ml-2">Cancelado</span>
              </label>
            </div>
          </div>
        </div>
        {/* Navegação da Semana */}
        <div className="flex items-center justify-between p-4 bg-white rounded shadow mb-4">
          <button
            type="button"
            aria-label="Semana Anterior"
            onClick={handlePreviousWeek}
          >
            <CaretLeft size={24} weight="fill" />
          </button>
          <div className="text-xl font-semibold">
            Semana de {format(startOfSelectedWeek, 'dd/MM/yyyy')} a{' '}
            {format(addDays(startOfSelectedWeek, 6), 'dd/MM/yyyy')}
          </div>
          <button
            type="button"
            aria-label="Próxima Semana"
            onClick={handleNextWeek}
          >
            <CaretRight size={24} weight="fill" />
          </button>
        </div>
        {/* Cabeçalho dos Dias da Semana */}
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
        {/* Grid de Agendamentos da Semana */}
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {daysOfWeek.map((day) => {
            const dayAgendamentos = filteredAgendamentos
              .filter((agendamento) =>
                isSameDay(new Date(agendamento.dataAgendamento), day),
              )
              .sort(sortByTime)

            return (
              <div
                key={day.toISOString()}
                className="min-h-[120px] p-2 bg-white"
              >
                <div className="font-semibold mb-1">{format(day, 'dd/MM')}</div>
                <div className="space-y-2">
                  {dayAgendamentos.map((agendamento) => (
                    <div
                      key={agendamento.id}
                      className={`text-xs leading-none p-1 space-y-1 rounded cursor-pointer transition-colors duration-200 group ${
                        agendamento.localAgendamento === 'Sala Verde'
                          ? 'text-green-600 hover:bg-slate-50'
                          : 'text-blue-600 hover:bg-slate-50'
                      } ${agendamento.statusAgendamento === 'Cancelado' || agendamento.statusAgendamento === 'Remarcado' ? 'bg-red-100' : 'bg-slate-100'}`}
                      onClick={() => handleEditAgenda(agendamento)}
                      onKeyDown={() => handleEditAgenda(agendamento)}
                    >
                      <div
                        className={`font-semibold group-hover:text-zinc-500 text-base ${agendamento.statusAgendamento === 'Cancelado' || agendamento.statusAgendamento === 'Remarcado' ? 'line-through' : ''}`}
                      >
                        {agendamento.horarioAgendamento} -{' '}
                        {agendamento.pacienteInfo.terapeutaInfo.nomeTerapeuta}
                      </div>
                      <hr
                        className={`border-2 ${agendamento.localAgendamento === 'Sala Verde' ? 'border-green-500' : 'border-blue-500'}`}
                      />
                      <div className="group-hover:text-zinc/90 text-base">
                        {agendamento.pacienteInfo.nomePaciente}
                      </div>
                      <div className="italic group-hover:text-zinc/70">
                        {agendamento.tipoAgendamento} -{' '}
                        {agendamento.modalidadeAgendamento} -{' '}
                        {agendamento.localAgendamento}
                      </div>
                      {agendamento.statusAgendamento !== 'Confirmado' && (
                        <div className="text-base font-semibold text-orange-500 group-hover:text-orange-600">
                          {agendamento.statusAgendamento}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
        <div className="bg-white text-center">
          <h3 className="text-lg font-semibold mt-4 p-2">
            Agendamentos que não precisam de sala
          </h3>
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
          {filteredAgendamentosNoRoom.sort(sortByTime).map((agendamento) => (
            <div
              key={agendamento.id}
              className="mt-4 p-4 rounded-lg bg-yellow-100 cursor-pointer transition-colors duration-200 group hover:bg-yellow-600 shadow-md leading-2"
              onClick={() => handleEditAgenda(agendamento)}
              onKeyDown={() => handleEditAgenda(agendamento)}
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
                <div
                  className={`font-medium text-slate-900 group-hover:text-white ${agendamento.statusAgendamento === 'Cancelado' || agendamento.statusAgendamento === 'Remarcado' ? 'line-through' : ''}`}
                >
                  {agendamento.horarioAgendamento} -{' '}
                  {agendamento.pacienteInfo.terapeutaInfo.nomeTerapeuta}
                </div>
                <hr className="border-2 border-yellow-400" />
                <div className="text-slate-500 group-hover:text-white/90">
                  {agendamento.pacienteInfo.nomePaciente}
                </div>

                <div className="text-sm italic text-slate-500 group-hover:text-white/70">
                  {agendamento.tipoAgendamento} -{' '}
                  {agendamento.modalidadeAgendamento}
                </div>
                {agendamento.statusAgendamento !== 'Confirmado' && (
                  <div className="text-base font-semibold text-orange-500 group-hover:text-orange-100">
                    {agendamento.statusAgendamento}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {agendaEditando && (
          <EditarAgendaModal
            agendamentoId={agendaEditando.id}
            open={isEditModalOpen}
            onClose={closeEditModal}
          />
        )}
      </main>
    </div>
  )
}
