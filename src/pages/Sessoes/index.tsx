import {
  CaretLeft,
  CaretRight,
  HandCoins,
  PencilSimple,
  Plus,
  TrashSimple,
  User,
} from '@phosphor-icons/react'
import { useContext } from 'react'
import { TerapeutasContext } from '../../contexts/TerapeutasContext'
import { SessoesContext } from '../../contexts/SessoesContext'
import { dateFormatter } from '../../utils/formatter'

export function Sessoes() {
  const { terapeutas } = useContext(TerapeutasContext)
  const { sessoes } = useContext(SessoesContext)

  // sessoes.map((sessao) =>
  //   console.log('Nome do Paciente:', sessao.pacienteInfo.nomePaciente),
  // )

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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="flex items-center space-x-4 p-4 bg-white rounded shadow">
            <User size={24} />
            <label htmlFor="psicólogo" className="text-xl font-semibold">
              Terapeuta:
            </label>
            <select className="text-xl" name="terapeutas" id="terapeutas">
              <option value="Todos">Todos</option>
              {terapeutas.map((terapeuta) => (
                <option key={terapeuta.id} value={terapeuta.nomeTerapeuta}>
                  {terapeuta.nomeTerapeuta}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-between p-4 bg-white rounded shadow order-last md:order-none">
            <button type="button">
              <CaretLeft size={24} weight="fill" />
            </button>
            <h2 className="text-xl font-semibold">
              Mês: Fevereiro - Ano: 2024
            </h2>
            <button type="button">
              <CaretRight size={24} weight="fill" />
            </button>
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
        <table className="listaSessoes w-full bg-white rounded shadow">
          <thead className="bg-rosa text-white">
            <tr>
              <th className="p-4">Paciente</th>
              <th className="p-4">Responsável</th>
              <th className="p-4">Terapeuta</th>
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
            {sessoes.map((sessao) => (
              <tr key={sessao.id}>
                <td className="p-4">{sessao.pacienteInfo.nomePaciente}</td>
                <td className="p-4">{sessao.pacienteInfo.nomeResponsavel}</td>
                <td className="p-4">{sessao.terapeutaInfo.nomeTerapeuta}</td>
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
      </main>
    </div>
  )
}
