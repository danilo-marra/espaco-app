import {
  Calendar,
  CaretLeft,
  CaretRight,
  HandCoins,
  Money,
  PencilSimple,
  Plus,
  TrashSimple,
  User,
  Users,
} from '@phosphor-icons/react'
import { useEffect, useMemo, useState } from 'react'
import { dateFormatter, priceFormatter } from '../../utils/formatter'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import type { Sessao } from '../../tipos'
import * as Dialog from '@radix-ui/react-dialog'
import Pagination from '../../components/Pagination'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from '../../store/store'
import { fetchSessoes } from '../../store/sessoesSlice'
import { fetchTerapeutas } from '../../store/terapeutasSlice'
import { NovaSessaoModal } from '../../components/Sessao/NovaSessaoModal'

interface SessaoCalculations {
  totalValue: number
  repasseValue: number
  repassePercentage: number
}

const countValidDates = (sessao: Sessao): number => {
  return [
    sessao.dtSessao1,
    sessao.dtSessao2,
    sessao.dtSessao3,
    sessao.dtSessao4,
    sessao.dtSessao5,
    sessao.dtSessao6,
  ].filter(Boolean).length
}

const calculateRepasseInfo = (sessao: Sessao): SessaoCalculations => {
  const validDates = countValidDates(sessao)
  const totalValue = sessao.valorSessao * validDates

  const dataEntrada = new Date(sessao.terapeutaInfo.dtEntrada)
  const umAnoAtras = new Date()
  umAnoAtras.setFullYear(umAnoAtras.getFullYear() - 1)

  const repassePercentage = dataEntrada <= umAnoAtras ? 0.5 : 0.45
  const repasseValue = totalValue * repassePercentage

  return {
    totalValue,
    repasseValue,
    repassePercentage,
  }
}

const filterSessoes = (
  sessoes: Sessao[],
  selectedTerapeuta: string,
  currentDate: Date,
  searchQuery: string,
): Sessao[] => {
  return sessoes.filter(
    (sessao) =>
      (selectedTerapeuta === 'Todos' ||
        sessao.terapeutaInfo?.id === selectedTerapeuta) &&
      new Date(sessao.dtSessao1).getMonth() === currentDate.getMonth() &&
      new Date(sessao.dtSessao1).getFullYear() === currentDate.getFullYear() &&
      sessao.pacienteInfo.nomePaciente
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
  )
}

export function Sessoes() {
  const dispatch = useDispatch<AppDispatch>()
  const terapeutas = useSelector((state: RootState) => state.terapeutas.data)
  const sessoes = useSelector((state: RootState) => state.sessoes.data)

  // Estados
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTerapeuta, setSelectedTerapeuta] = useState('Todos')

  // Constantes
  const SESSIONS_PER_PAGE = 10

  // Handlers para mudanças de estado
  const handleTerapeutaChange = (value: string) => {
    setSelectedTerapeuta(value)
    setCurrentPage(1)
  }

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setCurrentDate(date)
      setCurrentPage(1)
    }
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  const handleMonthChange = (increment: number) => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + increment,
      1,
    )
    setCurrentDate(newDate)
    setCurrentPage(1)
  }

  // Dados filtrados e cálculos usando useMemo
  const filteredSessoes = useMemo(
    () => filterSessoes(sessoes, selectedTerapeuta, currentDate, searchQuery),
    [sessoes, selectedTerapeuta, currentDate, searchQuery],
  )

  const totals = useMemo(() => {
    return filteredSessoes.reduce(
      (acc, sessao) => {
        const calculations = calculateRepasseInfo(sessao)
        return {
          totalValue: acc.totalValue + calculations.totalValue,
          totalRepasse: acc.totalRepasse + calculations.repasseValue,
        }
      },
      { totalValue: 0, totalRepasse: 0 },
    )
  }, [filteredSessoes])

  const paginatedSessoes = useMemo(() => {
    const startIndex = (currentPage - 1) * SESSIONS_PER_PAGE
    return filteredSessoes.slice(startIndex, startIndex + SESSIONS_PER_PAGE)
  }, [filteredSessoes, currentPage])

  const totalPages = Math.ceil(filteredSessoes.length / SESSIONS_PER_PAGE)

  // Effect para carregar dados iniciais
  useEffect(() => {
    dispatch(fetchSessoes())
    dispatch(fetchTerapeutas())
  }, [dispatch])

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 bg-gray-100 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Sessões</h1>
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <button
                type="button"
                className="flex items-center bg-azul text-white px-4 py-2 rounded hover:bg-sky-600"
              >
                <Plus size={20} weight="bold" className="mr-2" />
                Nova Sessão
              </button>
            </Dialog.Trigger>
            <NovaSessaoModal />
          </Dialog.Root>
        </div>

        {/* Filters and Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="flex items-center space-x-4 p-4 bg-white rounded shadow">
            <Users size={24} />
            <input
              className="text-xl w-full text-gray-800 focus:outline-none"
              type="text"
              placeholder="Buscar paciente"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-4 p-4 bg-white rounded shadow">
            <User size={24} />
            <label htmlFor="terapeutas" className="text-xl font-semibold">
              Terapeuta:
            </label>
            <select
              className="text-xl"
              value={selectedTerapeuta}
              onChange={(e) => handleTerapeutaChange(e.target.value)}
            >
              <option value="Todos">Todos</option>
              {terapeutas.map((terapeuta) => (
                <option key={terapeuta.id} value={terapeuta.id}>
                  {terapeuta.nomeTerapeuta}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-4 p-4 bg-white rounded shadow">
            <Money size={24} />
            <span className="text-xl font-semibold">
              Paciente: {priceFormatter.format(totals.totalValue)}
            </span>
          </div>
          <div className="flex items-center space-x-4 p-4 bg-white rounded shadow">
            <HandCoins size={24} />
            <span className="text-xl font-semibold">
              PSI: {priceFormatter.format(totals.totalRepasse)}
            </span>
          </div>
        </div>

        {/* Date Navigation */}
        <div className="flex items-center justify-between p-4 bg-white rounded shadow mb-4">
          <button type="button" onClick={() => handleMonthChange(-1)}>
            <CaretLeft size={24} weight="fill" />
          </button>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-semibold">
              {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
            </h2>
            <DatePicker
              selected={currentDate}
              onChange={handleDateChange}
              showMonthYearPicker
              dateFormat="MMMM yyyy"
              locale={ptBR}
              customInput={
                <Calendar size={28} className="text-gray-500 mt-2" />
              }
            />
          </div>
          <button type="button" onClick={() => handleMonthChange(1)}>
            <CaretRight size={24} weight="fill" />
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-rosa text-white">
              <tr>
                <th className="p-4">Terapeuta</th>
                <th className="p-4">Paciente</th>
                <th className="p-4">Responsável</th>
                <th className="p-4">Valor da Sessão</th>
                <th className="p-4">Nota Fiscal</th>
                <th className="p-4">Sessão 1</th>
                <th className="p-4">Sessão 2</th>
                <th className="p-4">Sessão 3</th>
                <th className="p-4">Sessão 4</th>
                <th className="p-4">Sessão 5</th>
                <th className="p-4">Sessão 6</th>
                <th className="p-4">Total</th>
                <th className="p-4">Repasse</th>
                <th className="p-4">Ações</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {paginatedSessoes.map((sessao) => {
                const calculations = calculateRepasseInfo(sessao)
                return (
                  <tr key={sessao.id}>
                    <td className="p-4">
                      {sessao.terapeutaInfo.nomeTerapeuta}
                    </td>
                    <td className="p-4">{sessao.pacienteInfo.nomePaciente}</td>
                    <td className="p-4">
                      {sessao.pacienteInfo.nomeResponsavel}
                    </td>
                    <td className="p-4">
                      {priceFormatter.format(sessao.valorSessao)}
                    </td>
                    <td className="p-4">{sessao.notaFiscal}</td>
                    {[1, 2, 3, 4, 5, 6].map((num) => {
                      const dateKey = `dtSessao${num}` as keyof Sessao
                      return (
                        <td key={num} className="p-4">
                          {sessao[dateKey]
                            ? dateFormatter.format(
                                new Date(sessao[dateKey] as string),
                              )
                            : 'N/A'}
                        </td>
                      )
                    })}
                    <td className="p-4">
                      {priceFormatter.format(calculations.totalValue)}
                    </td>
                    <td className="p-4">
                      {priceFormatter.format(calculations.repasseValue)} (
                      {calculations.repassePercentage * 100}%)
                    </td>
                    <td className="p-2 space-x-2">
                      <button
                        type="button"
                        className="text-green-500 hover:text-green-700"
                      >
                        <PencilSimple size={20} weight="bold" />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700"
                        type="button"
                      >
                        <TrashSimple size={20} weight="bold" />
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
