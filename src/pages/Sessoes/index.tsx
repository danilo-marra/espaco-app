import {
  Calendar,
  CaretLeft,
  CaretRight,
  HandCoins,
  PencilSimple,
  Plus,
  TrashSimple,
  User,
} from '@phosphor-icons/react'
import { useContext, useEffect, useState } from 'react'
import { TerapeutasContext } from '../../contexts/TerapeutasContext'
import { SessoesContext } from '../../contexts/SessoesContext'
import { dateFormatter, priceFormatter } from '../../utils/formatter'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import type { Sessao } from '../../tipos'
import Pagination from '../../components/Pagination'

export function Sessoes() {
  const { terapeutas, fetchTerapeutas } = useContext(TerapeutasContext)
  const { sessoes, fetchSessoes } = useContext(SessoesContext)
  const [dataAtual, setDataAtual] = useState<Date>(new Date())
  const [totalPages, setTotalPages] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState(1)
  const sessoesPerPage = 10
  const [selectedTerapeuta, setSelectedTerapeuta] = useState('Todos')
  const handleTerapeutaChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedTerapeuta(event.target.value)
  }
  const [filteredSessoes, setFilteredSessoes] = useState<Sessao[]>([])
  const indexOfLastSessoes = currentPage * sessoesPerPage
  const indexOfFirstSessoes = indexOfLastSessoes - sessoesPerPage
  const sessoesAtuais = filteredSessoes.slice(
    indexOfFirstSessoes,
    indexOfLastSessoes,
  )

  useEffect(() => {
    fetchTerapeutas()
    fetchSessoes()
  }, [fetchTerapeutas, fetchSessoes])

  useEffect(() => {
    // Filter sessoes by selected terapeuta
    const filteredByTerapeuta =
      selectedTerapeuta === 'Todos'
        ? sessoes
        : sessoes.filter(
            (sessao) => sessao.terapeutaInfo.id === selectedTerapeuta,
          )

    // Filter sessoes by date
    const filteredByDate = filteredByTerapeuta.filter((sessao) => {
      if (!sessao.dtSessao1) return false
      const dataSessao = new Date(sessao.dtSessao1)
      return (
        dataSessao.getMonth() === dataAtual.getMonth() &&
        dataSessao.getFullYear() === dataAtual.getFullYear()
      )
    })

    setFilteredSessoes(filteredByDate)
    setTotalPages(Math.ceil(filteredByDate.length / sessoesPerPage))
  }, [sessoes, selectedTerapeuta, dataAtual])

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  function handleMonthPrev() {
    setDataAtual(new Date(dataAtual.getFullYear(), dataAtual.getMonth() - 1, 1))
  }

  function handleMonthNext() {
    setDataAtual(new Date(dataAtual.getFullYear(), dataAtual.getMonth() + 1, 1))
  }

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 bg-gray-100 p-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Sessões</h1>
          <button
            type="button"
            className="flex items-center bg-azul text-white px-4 py-2 rounded hover:bg-sky-600"
          >
            <Plus size={20} weight="bold" className="mr-2" />
            Nova Sessão
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="flex items-center space-x-4 p-4 bg-white rounded shadow">
            <User size={24} />
            <label htmlFor="psicólogo" className="text-xl font-semibold">
              Terapeuta:
            </label>
            <select
              className="text-xl"
              name="terapeutas"
              id="terapeutas"
              value={selectedTerapeuta}
              onChange={handleTerapeutaChange}
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
            <HandCoins size={24} />
            <span className="text-xl font-semibold">R$ Paciente: 1820,00</span>
          </div>
          <div className="flex items-center space-x-4 p-4 bg-white rounded shadow">
            <HandCoins size={24} />
            <span className="text-xl font-semibold">R$ PSI: 819,00 (45%)</span>
          </div>
        </div>
        <div className="flex items-center justify-between p-4 bg-white rounded shadow">
          <button type="button">
            <CaretLeft onClick={handleMonthPrev} size={24} weight="fill" />
          </button>
          <div className="flex items-center space-x-2">
            <div>
              <h2 className="text-xl font-semibold">
                {format(dataAtual, 'MMMM yyyy', { locale: ptBR })}
              </h2>
            </div>
            <div>
              <div>
                <DatePicker
                  locale={ptBR}
                  selected={dataAtual}
                  onChange={(date) => date && setDataAtual(date)}
                  renderMonthContent={(_month, shortMonth, longMonth, day) => {
                    const fullYear = new Date(day).getFullYear()
                    const tooltipText = `${longMonth} de ${fullYear}`
                    return <span title={tooltipText}>{shortMonth}</span>
                  }}
                  showMonthYearPicker
                  dateFormat="MMMM yyyy"
                  customInput={
                    <Calendar size={28} className="text-gray-500 mt-2" />
                  }
                />
              </div>
            </div>
          </div>

          <button type="button">
            <CaretRight onClick={handleMonthNext} size={24} weight="fill" />
          </button>
        </div>
        <table className="listaSessoes w-full bg-white rounded shadow">
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
              <th className="p-4">Ações</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {sessoesAtuais.map((sessao) => (
              <tr key={sessao.id}>
                <td className="p-4">{sessao.terapeutaInfo.nomeTerapeuta}</td>
                <td className="p-4">{sessao.pacienteInfo.nomePaciente}</td>
                <td className="p-4">{sessao.pacienteInfo.nomeResponsavel}</td>
                <td className="p-4">R$ {sessao.valorSessao.toFixed(2)}</td>
                <td className="p-4">{sessao.notaFiscal}</td>
                <td className="p-4">
                  {sessao.dtSessao1
                    ? dateFormatter.format(new Date(sessao.dtSessao1))
                    : 'N/A'}
                </td>
                <td className="p-4">
                  {sessao.dtSessao2
                    ? dateFormatter.format(new Date(sessao.dtSessao2))
                    : 'N/A'}
                </td>
                <td className="p-4">
                  {sessao.dtSessao3
                    ? dateFormatter.format(new Date(sessao.dtSessao3))
                    : 'N/A'}
                </td>
                <td className="p-4">
                  {sessao.dtSessao4
                    ? dateFormatter.format(new Date(sessao.dtSessao4))
                    : 'N/A'}
                </td>
                <td className="p-4">
                  {sessao.dtSessao5
                    ? dateFormatter.format(new Date(sessao.dtSessao5))
                    : 'N/A'}
                </td>
                <td className="p-4">
                  {sessao.dtSessao6
                    ? dateFormatter.format(new Date(sessao.dtSessao6))
                    : 'N/A'}
                </td>
                <td className="p-4">
                  R$ {(sessao.valorSessao * 6).toFixed(2)}
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
            ))}
          </tbody>
        </table>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </main>
    </div>
  )
}
