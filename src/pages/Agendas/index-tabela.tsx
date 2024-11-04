import Pagination from '@/components/Pagination'
import { fetchAgendamentos } from '@/store/agendamentosSlice'
import type { AppDispatch, RootState } from '@/store/store'
import type { Agendamento } from '@/tipos'
import { format } from 'date-fns'
import {
  Calendar,
  CaretLeft,
  CaretRight,
  Plus,
  User,
} from '@phosphor-icons/react'
import { ptBR } from 'date-fns/locale'
import { useEffect, useMemo, useState } from 'react'
import DatePicker from 'react-datepicker'
import { useDispatch, useSelector } from 'react-redux'

const filterAgendamentos = (agendamentos: Agendamento[]): Agendamento[] => {
  return agendamentos
}

export function Agendas() {
  const dispatch = useDispatch<AppDispatch>()
  const agendamentos = useSelector(
    (state: RootState) => state.agendamentos.data,
  )

  // Estados
  const [currentPage, setCurrentPage] = useState(1)

  // Constantes
  const AGENDAMENTOS_PER_PAGE = 10

  // Dados filtrados usando useMemo
  const filteredAgendamentos = useMemo(
    () => filterAgendamentos(agendamentos),
    [agendamentos],
  )

  // Paginação
  const paginatedAgendamentos = useMemo(() => {
    const startIndex = (currentPage - 1) * AGENDAMENTOS_PER_PAGE
    return filteredAgendamentos.slice(
      startIndex,
      startIndex + AGENDAMENTOS_PER_PAGE,
    )
  }, [currentPage, filteredAgendamentos])

  const totalPages = Math.ceil(
    filteredAgendamentos.length / AGENDAMENTOS_PER_PAGE,
  )

  // Modal
  // const {
  //   isModalOpen,
  //   modalMessage,
  //   isEditModalOpen,
  //   openModal,
  //   closeModal,
  //   openEditModal,
  //   closeEditModal,
  // } = useModal()

  // const isValidTime = (time: string): boolean => {
  //   return /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(time);
  // }

  // Effect para carregar dados iniciais
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
            <select id="terapeutas" className="text-xl">
              <option value="Todos">Todos</option>
              <option>Terapeuta 01</option>
            </select>
          </div>
        </div>
        {/* Date Navigation */}
        <div className="flex items-center justify-between p-4 bg-white rounded shadow mb-4">
          <button type="button" aria-label="Previous month">
            <CaretLeft size={24} weight="fill" />
          </button>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-semibold">Janeiro 2021</h2>
            <DatePicker
              showMonthYearPicker
              dateFormat="MMMM yyyy"
              customInput={
                <button type="button" aria-label="Select month and year">
                  <Calendar size={28} className="text-gray-500 mt-2" />
                </button>
              }
            />
          </div>
          <button type="button" aria-label="Next month">
            <CaretRight size={24} weight="fill" />
          </button>
        </div>
        {/* Table Agenda */}
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-rosa text-white">
              <tr>
                <th className="p-4">Terapeuta</th>
                <th className="p-4">Paciente</th>
                <th className="p-4">Data</th>
                <th className="p-4">Horário</th>
                <th className="p-4">Local</th>
                <th className="p-4">Tipo</th>
                <th className="p-4">Modalidade</th>
                <th className="p-4">Status</th>
                <th className="p-4">Observações</th>
                <th className="p-4">Ações</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {paginatedAgendamentos.map((agendamento) => {
                return (
                  <tr key={agendamento.id}>
                    <td className="p-4">
                      {agendamento.terapeutaInfo.nomeTerapeuta}
                    </td>
                    <td className="p-4">
                      {agendamento.pacienteInfo.nomePaciente}
                    </td>
                    <td className="p-4">
                      {format(
                        new Date(agendamento.dataAgendamento),
                        'dd/MM/yyyy - EEE',
                        {
                          locale: ptBR,
                        },
                      ).replace(
                        / - (.)/,
                        (_, letra) => ` - ${letra.toUpperCase()}`,
                      )}
                    </td>
                    <td className="p-4">{agendamento.horarioAgendamento}</td>
                    <td className="p-4">{agendamento.localAgendamento}</td>
                    <td className="p-4">{agendamento.tipoAgendamento}</td>
                    <td className="p-4">{agendamento.modalidadeAgendamento}</td>
                    <td className="p-4">{agendamento.statusAgendamento}</td>
                    <td className="p-4">
                      {agendamento.observacoesAgendamento}
                    </td>
                    <td className="p-4">
                      <button type="button" aria-label="Editar agendamento">
                        Editar
                      </button>
                      <button type="button" aria-label="Excluir agendamento">
                        Excluir
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </main>
    </div>
  )
}
