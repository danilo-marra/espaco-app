import {
  ArrowCircleDown,
  ArrowCircleUp,
  Calendar,
  CaretLeft,
  CaretRight,
  CashRegister,
  CurrencyDollar,
  PencilSimple,
  Plus,
  TrashSimple,
} from '@phosphor-icons/react'
import { useContext, useEffect, useState } from 'react'
import { TransacoesContext } from '../../contexts/TransacoesContext'
import { NovaTransacaoModal } from '../../components/Transacao/NovaTransacaoModal'
import { EditarTransacaoModal } from '../../components/Transacao/EditarTransacaoModal'
import type { Transacao } from '../../tipos'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { dateFormatter, priceFormatter } from '../../utils/formatter'
import Pagination from '../../components/Pagination'
import * as Dialog from '@radix-ui/react-dialog'
import axios from 'axios'

export function Transacoes() {
  const [isMenuOpen] = useState<boolean>(false)
  const { transacoes, fetchTransacoes } = useContext(TransacoesContext)
  const [dataAtual, setDataAtual] = useState<Date>(new Date())
  const [summary, setSummary] = useState({ entrada: 0, saida: 0, total: 0 })
  const [searchValue, setSearchValue] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)
  const transacoesPorPagina = 10
  const [transacoesVisiveis, setTransacoesVisiveis] = useState<Transacao[]>([])
  const [totalPages, settotalPages] = useState<number>(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState('')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [transacaoEditando, setTransacaoEditando] = useState<Transacao | null>(
    null,
  )

  useEffect(() => {
    fetchTransacoes()
  }, [fetchTransacoes])

  useEffect(() => {
    const filteredBySearch = transacoes.filter((transacao) =>
      transacao.descricao.toLowerCase().includes(searchValue.toLowerCase()),
    )

    const filteredByDate = filteredBySearch.filter((transacao) => {
      const dataTransacao = new Date(transacao.dtCriacao)
      return (
        dataTransacao.getMonth() === dataAtual.getMonth() &&
        dataTransacao.getFullYear() === dataAtual.getFullYear()
      )
    })

    const newSummary = filteredByDate.reduce(
      (acc, transacao) => {
        if (transacao.tipo === 'entrada') {
          acc.entrada += transacao.valor
          acc.total += transacao.valor
        } else {
          acc.saida += transacao.valor
          acc.total -= transacao.valor
        }
        return acc
      },
      { entrada: 0, saida: 0, total: 0 },
    )

    setSummary(newSummary)

    const offset = (currentPage - 1) * transacoesPorPagina
    setTransacoesVisiveis(
      filteredByDate.slice(offset, offset + transacoesPorPagina),
    )
    settotalPages(Math.ceil(filteredByDate.length / transacoesPorPagina))
  }, [dataAtual, transacoes, searchValue, currentPage])

  function handleMonthPrev() {
    setDataAtual(new Date(dataAtual.getFullYear(), dataAtual.getMonth() - 1, 1))
  }

  function handleMonthNext() {
    setDataAtual(new Date(dataAtual.getFullYear(), dataAtual.getMonth() + 1, 1))
  }

  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchValue(event.target.value)
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  async function handleDeleteTransacao(id: string) {
    try {
      await axios.delete(`http://localhost:3000/transacoes/${id}`)
      setModalMessage('Transação excluída com sucesso!')
      setIsModalOpen(true)
      fetchTransacoes() // Atualiza a lista de transações
      console.log('Transação excluída:', id)
    } catch (error) {
      setModalMessage('Erro ao excluir transação. Tente novamente.')
      setIsModalOpen(true)
      console.error('Erro ao excluir transação:', error)
    }
  }

  function handleEditTransacao(transacao: Transacao) {
    setTransacaoEditando(transacao)
    setIsEditModalOpen(true)
  }

  return (
    <div className="flex min-h-screen">
      <main
        className={`flex-1 bg-gray-100 p-8 transition-all duration-300 ease-in-out ${isMenuOpen ? 'md:ml-64' : 'ml-0'}`}
      >
        <div>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Transacoes</h1>

            <Dialog.Root>
              <Dialog.Trigger asChild>
                <button
                  type="button"
                  className="flex items-center bg-azul text-white px-4 py-2 rounded hover:bg-sky-600 duration-150"
                >
                  <Plus size={20} weight="bold" className="mr-2" />
                  Nova Transação
                </button>
              </Dialog.Trigger>
              <NovaTransacaoModal />
            </Dialog.Root>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="flex items-center space-x-4 p-4 bg-white rounded shadow ">
              <CashRegister size={24} />
              <input
                className="text-xl w-full  text-gray-800 focus:outline-none"
                type="text"
                placeholder="Buscar transações..."
                value={searchValue}
                onChange={handleSearchChange}
              />
            </div>

            <div className="flex items-center space-x-1 p-4 bg-white rounded text-green-500 ">
              <ArrowCircleUp size={24} weight="fill" />
              <span className="text-xl">
                Entradas: <span>{priceFormatter.format(summary.entrada)}</span>
              </span>
            </div>

            <div className="flex items-center space-x-1 p-4 bg-white rounded shadow text-red-500 ">
              <ArrowCircleDown size={24} weight="fill" />
              <span className="text-xl">
                Saídas: <span>{priceFormatter.format(summary.saida)}</span>
              </span>
            </div>

            <div
              className={`flex items-center space-x-1 p-4 bg-white rounded shadow font-bold ${summary.total >= 0 ? 'text-green-500' : 'text-red-500'}`}
            >
              <CurrencyDollar size={24} />
              <span className="text-xl">
                Total: <span>{priceFormatter.format(summary.total)}</span>
              </span>
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
                <button type="button">
                  <DatePicker
                    locale={ptBR}
                    selected={dataAtual}
                    onChange={(date) => date && setDataAtual(date)}
                    renderMonthContent={(
                      _month,
                      shortMonth,
                      longMonth,
                      day,
                    ) => {
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
                </button>
              </div>
            </div>

            <button type="button">
              <CaretRight onClick={handleMonthNext} size={24} weight="fill" />
            </button>
          </div>

          <table className="w-full bg-white rounded shadow">
            <thead className="bg-rosa text-white">
              <tr>
                <th className="p-4 text-left">Descrição</th>
                <th className="p-4 text-left">Valor</th>
                <th className="p-4 text-left">Data</th>
                <th className="p-4 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {transacoesVisiveis.map((transacao) => {
                return (
                  <tr key={transacao.id}>
                    <td className="p-4">{transacao.descricao}</td>

                    <td
                      className={`p-4 d-flex ${transacao.tipo === 'entrada' ? 'text-green-500' : 'text-red-500'}`}
                    >
                      {transacao.tipo === 'entrada' ? (
                        <div className="flex items-center space-x-1">
                          <ArrowCircleUp
                            size={24}
                            color="rgb(34 197 94)"
                            weight="fill"
                          />
                          <span>{priceFormatter.format(transacao.valor)}</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1">
                          <ArrowCircleDown
                            size={24}
                            color="rgb(239 68 68)"
                            weight="fill"
                          />
                          <span>{priceFormatter.format(transacao.valor)}</span>
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      {dateFormatter.format(new Date(transacao.dtCriacao))}
                    </td>
                    <td className="p-4 flex space-x-2">
                      <button
                        title="Editar Transação"
                        className="text-green-500 hover:text-green-700"
                        type="button"
                        onClick={() => handleEditTransacao(transacao)}
                      >
                        <PencilSimple size={20} weight="bold" />
                      </button>
                      <button
                        title="Excluir Transação"
                        className="text-red-500 hover:text-red-700"
                        type="button"
                        onClick={() => handleDeleteTransacao(transacao.id)}
                      >
                        <TrashSimple size={20} weight="bold" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </main>
      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded shadow-lg">
          <Dialog.Title className="text-lg font-bold">Informação</Dialog.Title>
          <Dialog.Description className="mt-2">
            {modalMessage}
          </Dialog.Description>
          <div className="mt-4 flex justify-end">
            <Dialog.Close asChild>
              <button
                type="button"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Fechar
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Root>
      {transacaoEditando && (
        <EditarTransacaoModal
          transacaoId={transacaoEditando.id}
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  )
}
