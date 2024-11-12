import { deleteAgendamento, fetchAgendamentos } from '@/store/agendamentosSlice'
import type { RootState, AppDispatch } from '@/store/store'
import {
  CalendarCheck,
  CaretLeft,
  CaretRight,
  Door,
  Plus,
  Trash,
  User,
} from '@phosphor-icons/react'
import {
  addDays,
  addMonths,
  addWeeks,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isSameWeek,
  startOfMonth,
  startOfWeek,
  subMonths,
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
import { toast } from 'sonner'
import { ExcluirAgendaModal } from '@/components/Agenda/ExcluirAgendaModal'

export function Agendas() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'semanal' | 'mensal'>('semanal')

  // Funções para alternar entre as visualizações
  const handleSetWeeklyView = () => setViewMode('semanal')
  const handleSetMonthlyView = () => setViewMode('mensal')

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
  const [agendamentoParaExcluir, setAgendamentoParaExcluir] =
    useState<Agendamento | null>(null)
  const [isExcluirModalOpen, setIsExcluirModalOpen] = useState(false)

  // Modal
  const { isEditModalOpen, openEditModal, closeEditModal } = useModal()
  const openExcluirModal = (agendamento: Agendamento) => {
    setAgendamentoParaExcluir(agendamento)
    setIsExcluirModalOpen(true)
  }

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

  const handleDeleteAgendamento = async (deleteAll: boolean) => {
    if (!agendamentoParaExcluir) return
    try {
      if (deleteAll) {
        const agendamentosPaciente = agendamentos.filter(
          (agendamento) =>
            agendamento.pacienteInfo.id ===
            agendamentoParaExcluir.pacienteInfo.id,
        )
        await Promise.all(
          agendamentosPaciente.map((agendamento) =>
            dispatch(deleteAgendamento(agendamento.id)).unwrap(),
          ),
        )
        toast.info('Todos os agendamentos do paciente foram excluídos!')
      } else {
        await dispatch(deleteAgendamento(agendamentoParaExcluir.id)).unwrap()
        toast.info('Agendamento excluído com sucesso!')
      }
    } catch (error) {
      toast.error('Erro ao excluir agendamento!')
      console.error('Erro ao excluir agendamento:', error)
    } finally {
      setIsExcluirModalOpen(false)
      setAgendamentoParaExcluir(null)
    }
  }

  // Navegação entre semanas e meses
  const handlePrevious = () => {
    if (viewMode === 'semanal') {
      setSelectedDate(subWeeks(selectedDate, 1))
    } else {
      setSelectedDate(subMonths(selectedDate, 1))
    }
  }

  const handleNext = () => {
    if (viewMode === 'semanal') {
      setSelectedDate(addWeeks(selectedDate, 1))
    } else {
      setSelectedDate(addMonths(selectedDate, 1))
    }
  }

  // Função para obter os dias do mês
  const getDaysInMonth = (date: Date) => {
    const start = startOfWeek(startOfMonth(date))
    const end = endOfWeek(endOfMonth(date))
    return eachDayOfInterval({ start, end })
  }

  const daysOfMonth = getDaysInMonth(selectedDate)

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
        {/* Botões para alternar entre as visualizações */}
        <div className="flex space-x-4 mb-4">
          <button
            type="button"
            onClick={handleSetWeeklyView}
            className={`px-4 py-2 rounded ${
              viewMode === 'semanal'
                ? 'bg-azul text-white'
                : 'bg-white text-azul'
            }`}
          >
            Semanal
          </button>
          <button
            type="button"
            onClick={handleSetMonthlyView}
            className={`px-4 py-2 rounded ${
              viewMode === 'mensal'
                ? 'bg-azul text-white'
                : 'bg-white text-azul'
            }`}
          >
            Mensal
          </button>
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
          <button type="button" aria-label="Anterior" onClick={handlePrevious}>
            <CaretLeft size={24} weight="fill" />
          </button>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-semibold">
              {viewMode === 'semanal'
                ? `${format(selectedDate, 'MMMM', { locale: ptBR }).replace(/^\w/, (c) => c.toUpperCase())} - Semana de ${format(startOfSelectedWeek, 'dd/MM/yyyy')} até ${format(addDays(startOfSelectedWeek, 6), 'dd/MM/yyyy')}`
                : format(selectedDate, 'MMMM yyyy', { locale: ptBR }).replace(
                    /^\w/,
                    (c) => c.toUpperCase(),
                  )}
            </h2>
          </div>
          <button type="button" aria-label="Próximo" onClick={handleNext}>
            <CaretRight size={24} weight="fill" />
          </button>
        </div>
        {/* Cabeçalho dos Dias da Semana */}

        {/* Grid de Agendamentos da Semana */}
        {viewMode === 'semanal' ? (
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
                    <div className="font-semibold mb-1">
                      {format(day, 'dd/MM')}
                    </div>
                    <div className="space-y-2">
                      {dayAgendamentos.map((agendamento) => (
                        <div
                          key={agendamento.id}
                          className={`text-sm p-1 space-y-1 rounded cursor-pointer transition-colors duration-200 hover:bg-slate-50 group ${agendamento.statusAgendamento === 'Cancelado' || agendamento.statusAgendamento === 'Remarcado' ? 'bg-red-100' : ''} ${agendamento.statusAgendamento === 'Cancelado' || agendamento.statusAgendamento === 'Remarcado' ? 'line-through' : ''}`}
                          onClick={() => handleEditAgenda(agendamento)}
                          onKeyDown={() => handleEditAgenda(agendamento)}
                        >
                          <div className="flex justify-between">
                            <div className="group-hover:text-zinc-500 font-semibold">
                              {agendamento.horarioAgendamento} -{' '}
                              {
                                agendamento.pacienteInfo.terapeutaInfo
                                  .nomeTerapeuta
                              }
                            </div>
                            <div>
                              <button
                                type="button"
                                title="Excluir agendamento"
                                className="text-red-400 group-hover:text-red-600"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  openExcluirModal(agendamento)
                                }}
                                onKeyDown={(e) => {
                                  e.stopPropagation()
                                  openExcluirModal(agendamento)
                                }}
                              >
                                <Trash size={20} weight="bold">
                                  Exluir
                                </Trash>
                              </button>
                            </div>
                          </div>
                          <div className="group-hover:text-zinc/90">
                            {agendamento.pacienteInfo.nomePaciente}
                          </div>
                          <div className=" italic text-slate-500 group-hover:text-zinc-500">
                            {agendamento.tipoAgendamento} -{' '}
                            {agendamento.modalidadeAgendamento}
                          </div>

                          <hr
                            className={`border-2 ${agendamento.localAgendamento === 'Sala Verde' ? 'border-green-500' : 'border-blue-500'}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
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
              {daysOfMonth.map((day) => {
                const dayAgendamentos = filteredAgendamentos
                  .filter((agendamento) =>
                    isSameDay(new Date(agendamento.dataAgendamento), day),
                  )
                  .sort(sortByTime)
                const isCurrentMonth = isSameMonth(day, selectedDate)
                return (
                  <div
                    key={day.toISOString()}
                    className={`min-h-[100px] p-2 bg-white ${
                      !isCurrentMonth ? 'bg-gray-100' : ''
                    }`}
                  >
                    <div className="text-sm font-semibold">
                      {format(day, 'd')}
                    </div>
                    {dayAgendamentos.map((agendamento) => (
                      <div
                        key={agendamento.id}
                        className={`mt-1 p-1 text-xs cursor-pointer hover:bg-slate-100 transition-colors duration-200 ${agendamento.statusAgendamento === 'Cancelado' || agendamento.statusAgendamento === 'Remarcado' ? 'bg-red-100' : ''} ${agendamento.statusAgendamento === 'Cancelado' || agendamento.statusAgendamento === 'Remarcado' ? 'line-through' : ''}`}
                        onClick={() => handleEditAgenda(agendamento)}
                        onKeyDown={() => handleEditAgenda(agendamento)}
                      >
                        <div className="flex justify-between">
                          <div className="font-semibold">
                            {agendamento.horarioAgendamento} -{' '}
                            {
                              agendamento.pacienteInfo.terapeutaInfo
                                .nomeTerapeuta
                            }
                          </div>
                          <div>
                            <button
                              type="button"
                              title="Excluir agendamento"
                              className="text-red-500"
                              onClick={(e) => {
                                e.stopPropagation()
                                openExcluirModal(agendamento)
                              }}
                              onKeyDown={(e) => {
                                e.stopPropagation()
                                openExcluirModal(agendamento)
                              }}
                            >
                              <Trash size={16} weight="bold" />
                            </button>
                          </div>
                        </div>
                        <div>{agendamento.pacienteInfo.nomePaciente}</div>
                        <hr
                          className={`my-2 border-2 ${agendamento.localAgendamento === 'Sala Verde' ? 'border-green-500' : 'border-blue-500'} `}
                        />
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="bg-white text-center">
          <h3 className="text-lg font-semibold mt-4 p-2">
            Agendamentos que não precisam de sala
          </h3>
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
          {filteredAgendamentosNoRoom.sort(sortByTime).map((agendamento) => (
            <div
              key={agendamento.id}
              className="mt-4 p-4 rounded-lg bg-yellow-100 cursor-pointer transition-colors duration-200 group hover:bg-yellow-200 shadow-md leading-2"
              onClick={() => handleEditAgenda(agendamento)}
              onKeyDown={() => handleEditAgenda(agendamento)}
            >
              <div className="mb-2">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-slate-500 group-hover:text-zinc-500 text-sm">
                    {format(
                      new Date(agendamento.dataAgendamento),
                      'dd/MM/yyyy',
                    )}{' '}
                    (
                    {format(new Date(agendamento.dataAgendamento), 'EEEE', {
                      locale: ptBR,
                    }).replace(/^\w/, (c) => c.toUpperCase())}
                    )
                  </div>
                  <div>
                    <button
                      type="button"
                      title="Excluir agendamento"
                      className="text-red-500"
                      onClick={(e) => {
                        e.stopPropagation()
                        openExcluirModal(agendamento)
                      }}
                      onKeyDown={(e) => {
                        e.stopPropagation()
                        openExcluirModal(agendamento)
                      }}
                    >
                      <Trash size={20} weight="bold" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <div
                  className={`font-medium text-slate-900 group-hover:text-zinc-500 ${agendamento.statusAgendamento === 'Cancelado' || agendamento.statusAgendamento === 'Remarcado' ? 'line-through' : ''}`}
                >
                  {agendamento.horarioAgendamento} -{' '}
                  {agendamento.pacienteInfo.terapeutaInfo.nomeTerapeuta}
                </div>
                <div className="text-slate-500 group-hover:text-zinc-500">
                  {agendamento.pacienteInfo.nomePaciente}
                </div>
                <div className="text-sm italic text-slate-500 group-hover:text-zinc-500">
                  {agendamento.tipoAgendamento} -{' '}
                  {agendamento.modalidadeAgendamento}
                </div>
                <hr className="border-2 border-yellow-400" />

                {agendamento.statusAgendamento !== 'Confirmado' && (
                  <div className="text-base font-semibold text-orange-500 group-hover:text-orange-700">
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
        <ExcluirAgendaModal
          isOpen={isExcluirModalOpen}
          onOpenChange={(isOpen) => setIsExcluirModalOpen(isOpen)}
          title="Excluir Agendamento"
          message="Deseja excluir este agendamento?"
          messageAll="Excluir também todos os outros agendamentos deste paciente?"
          onConfirm={handleDeleteAgendamento}
          checked={false}
        />
      </main>
    </div>
  )
}
