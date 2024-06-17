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
import { Transacao } from '../../tipos'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

export function Transacoes() {
  const [isMenuOpen] = useState<boolean>(false)
  const { transacoes } = useContext(TransacoesContext)
  const [dataAtual, setDataAtual] = useState<Date>(new Date())
  // const dataAtualStr = dataAtual.toISOString().split('T')[0]
  const [summary, setSummary] = useState({ entrada: 0, saida: 0, total: 0 })
  const [transacoesDoMes, setTransacoesDoMes] = useState<Transacao[]>([])

  useEffect(() => {
    // Atualize o estado transacoesDoMes quando a data atual ou as transações mudarem
    const newTransacoesDoMes = transacoes.filter((transacao) => {
      const dataTransacao = new Date(transacao.dtCriacao)
      return (
        dataTransacao.getMonth() === dataAtual.getMonth() &&
        dataTransacao.getFullYear() === dataAtual.getFullYear()
      )
    })

    setTransacoesDoMes(newTransacoesDoMes)

    const newSummary = newTransacoesDoMes.reduce(
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
  }, [dataAtual, transacoes])

  function handleMonthPrev() {
    const data = new Date(dataAtual)
    data.setMonth(data.getMonth() - 1)
    setDataAtual(data)
  }

  function handleMonthNext() {
    const data = new Date(dataAtual)
    data.setMonth(data.getMonth() + 1)
    setDataAtual(data)
  }

  return (
    <div className="flex min-h-screen">
      <main
        className={`flex-1 bg-gray-100 p-8 transition-all duration-300 ease-in-out ${isMenuOpen ? 'md:ml-64' : 'ml-0'}`}
      >
        <div>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Transacoes</h1>
            <button
              type="button"
              className="flex items-center bg-azul text-white px-4 py-2 rounded hover:bg-sky-600 duration-150"
            >
              <Plus size={20} weight="bold" className="mr-2" />
              Nova Transação
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="flex items-center space-x-4 p-4 bg-white rounded shadow ">
              <CashRegister size={24} />
              <input
                className="text-xl w-full  text-gray-800 focus:outline-none"
                type="text"
                placeholder="Buscar transações..."
              />
            </div>

            <div className="flex items-center space-x-1 p-4 bg-white rounded text-green-500 ">
              <ArrowCircleUp size={24} weight="fill" />
              <span className="text-xl">
                Entradas: <span>{summary.entrada}</span>
              </span>
            </div>

            <div className="flex items-center space-x-1 p-4 bg-white rounded shadow text-red-500 ">
              <ArrowCircleDown size={24} weight="fill" />
              <span className="text-xl">
                Saídas: <span>{summary.saida}</span>
              </span>
            </div>

            <div
              className={`flex items-center space-x-1 p-4 bg-white rounded shadow font-bold ${summary.total >= 0 ? 'text-green-500' : 'text-red-500'}`}
            >
              <CurrencyDollar size={24} />
              <span className="text-xl">
                Total: <span>{summary.total}</span>
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
                <button>
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

            <button>
              <CaretRight onClick={handleMonthNext} size={24} weight="fill" />
            </button>
          </div>

          <table className="listaPacientes w-full bg-white rounded shadow">
            <thead className="bg-rosa text-white">
              <tr>
                <th className="p-4 text-left">Descrição</th>
                <th className="p-4 text-left">Valor</th>
                <th className="p-4 text-left">Data</th>
                <th className="p-4 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {transacoesDoMes.map((transacao) => {
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
                          <span>{transacao.valor}</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1">
                          <ArrowCircleDown
                            size={24}
                            color="rgb(239 68 68)"
                            weight="fill"
                          />
                          <span>{transacao.valor}</span>
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      {format(new Date(transacao.dtCriacao), 'dd/MM/yyyy')}
                    </td>
                    <td className="p-4 flex space-x-2">
                      <button
                        title="Editar Paciente"
                        className="text-green-500 hover:text-green-700"
                      >
                        <PencilSimple size={20} weight="bold" />
                      </button>
                      <button
                        title="Excluir Paciente"
                        className="text-red-500 hover:text-red-700"
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
      </main>
    </div>
  )
}
