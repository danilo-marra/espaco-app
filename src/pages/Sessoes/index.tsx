// src/components/Sessoes.tsx

import React, { useState } from 'react'
import {
  PencilSimple,
  TrashSimple,
  Eye,
  Plus,
  User,
  CaretLeft,
  CaretRight,
  HandCoins,
} from '@phosphor-icons/react'
import { SessaoPaciente, SessaoDt } from '../../tipos'
import { Header } from '../../components/Header'
import { PacienteDetalhes } from '../../components/PacidenteDetalhes'
import { NovaSessao } from '../../components/NovaSessao'

const initialSessoesDt: SessaoPaciente[] = [
  {
    id: '01',
    pacienteInfo: {
      nome: 'Davi',
      responsavel: 'Pai do Davi',
      cpfResponsavel: '123.456.789-00',
      endereco: 'Rua A, 123',
    },
    valor: 200,
    notaFiscal: true,
    psicologa: 'Juliana',
    sessoesDt: [
      {
        dtSessao1: new Date(),
        dtSessao2: new Date(),
        dtSessao3: new Date(),
        dtSessao4: undefined,
        dtSessao5: undefined,
        dtSessao6: undefined,
      },
    ],
  },
  {
    id: '02',
    pacienteInfo: {
      nome: 'Heitor',
      responsavel: 'Avó do Heitor',
      cpfResponsavel: '987.654.321-00',
      endereco: 'Rua B, 456',
    },
    valor: 400,
    notaFiscal: false,
    psicologa: 'Juliana',
    sessoesDt: [
      {
        dtSessao1: new Date(),
        dtSessao2: new Date(),
        dtSessao3: new Date(),
        dtSessao4: new Date(),
        dtSessao5: new Date(),
        dtSessao6: undefined,
      },
    ],
  },
  {
    id: '03',
    pacienteInfo: {
      nome: 'Matheus',
      responsavel: 'Mãe do Matheus',
      cpfResponsavel: '123.444.222-69',
      endereco: 'Rua B, 456',
    },
    valor: 600,
    notaFiscal: true,
    psicologa: 'Mariana',
    sessoesDt: [
      {
        dtSessao1: new Date(),
        dtSessao2: undefined,
        dtSessao3: undefined,
        dtSessao4: undefined,
        dtSessao5: undefined,
        dtSessao6: undefined,
      },
    ],
  },
]

export function Sessoes() {
  const [isMenuOpen] = useState<boolean>(false)
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false)
  const [isNovaSessaoOpen, setIsNovaSessaoOpen] = useState<boolean>(false)
  const [selectedPaciente, setSelectedPaciente] =
    useState<SessaoPaciente | null>(null)
  const [sessoes, setSessoes] = useState<SessaoPaciente[]>(initialSessoesDt)

  const openPopup = (paciente: SessaoPaciente) => {
    setSelectedPaciente(paciente)
    setIsPopupOpen(true)
  }

  const closePopup = () => {
    setSelectedPaciente(null)
    setIsPopupOpen(false)
  }

  const openNovaSessao = () => {
    setIsNovaSessaoOpen(true)
  }

  const closeNovaSessao = () => {
    setIsNovaSessaoOpen(false)
  }

  const addNovaSessao = (novaSessao: SessaoPaciente) => {
    setSessoes([...sessoes, novaSessao])
  }

  const formatDate = (date?: Date) => {
    return date
      ? date.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      : 'N/A'
  }

  const countSessions = (sessoesDt: SessaoDt[]) => {
    return sessoesDt.reduce((count, sessao) => {
      return (
        count +
        [
          sessao.dtSessao1,
          sessao.dtSessao2,
          sessao.dtSessao3,
          sessao.dtSessao4,
          sessao.dtSessao5,
          sessao.dtSessao6,
        ].filter((date) => date !== undefined).length
      )
    }, 0)
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  const handleDeleteSessao = (sessaoToDelete: string) => {
    if (window.confirm('Você tem certeza que quer deletar esta sessão?')) {
      const sessaoWithoutDeletedOne = sessoes.filter(
        (sessao) => sessao.id !== sessaoToDelete,
      )
      setSessoes(sessaoWithoutDeletedOne)
    }
  }

  return (
    <div className="flex min-h-screen">
      <main
        className={`flex-1 bg-gray-100 p-8 transition-all duration-300 ease-in-out ${isMenuOpen ? 'md:ml-64' : 'ml-0'}`}
      >
        <Header />
        <div>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Sessoes</h1>
            <button
              type="button"
              className="flex items-center bg-azul text-white px-4 py-2 rounded hover:bg-sky-600"
              onClick={openNovaSessao}
            >
              <Plus size={20} weight="bold" className="mr-2" />
              Novo Registro
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="flex items-center space-x-4 p-4 bg-white rounded shadow">
              <User size={24} />
              <label htmlFor="psicólogo" className="text-xl font-semibold">
                Psicólogo(a):
              </label>
              <select className="text-xl" name="terapeutas" id="terapeutas">
                <option value="Todos">Todos</option>
                <option value="Juliana">Juliana</option>
                <option value="Julia">Julia</option>
                <option value="Francisca">Francisca</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-4 bg-white rounded shadow">
              <button type="button">
                <CaretLeft size={24} weight="fill" />
              </button>
              <h2 className="text-xl font-semibold">
                Mês: Fevereiro - Ano: 2024
              </h2>
              <button>
                <CaretRight size={24} weight="fill" />
              </button>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-white rounded shadow">
              <HandCoins size={24} />
              <span className="text-xl font-semibold">Receita: R$920,00</span>
            </div>
          </div>
          <div>
            <label htmlFor="psicólogo">Psicólogo(a): </label>
            <select name="terapeutas" id="terapeutas">
              <option value="Todos">Todos</option>
              <option value="Juliana">Juliana</option>
              <option value="Julia">Julia</option>
              <option value="Francisca">Francisca</option>
            </select>
          </div>
          <div>
            <span>Mês</span>
          </div>
          <div>
            <span>R$ Paciente: </span>
          </div>
          <div>
            <span>R$ PSI: </span>
          </div>
          <table className="listaTerapeutas w-full bg-white rounded shadow">
            <thead className="bg-rosa text-white">
              <tr>
                <th className="p-4 text-left">Paciente</th>
                <th className="p-4 text-left">Responsável</th>
                <th className="p-4 text-left">Valor da Sessão</th>
                <th className="p-4 text-left">Nota Fiscal Emitida?</th>
                <th className="p-4 text-left">Sessão 1</th>
                <th className="p-4 text-left">Sessão 2</th>
                <th className="p-4 text-left">Sessão 3</th>
                <th className="p-4 text-left">Sessão 4</th>
                <th className="p-4 text-left">Sessão 5</th>
                <th className="p-4 text-left">Sessão 6</th>
                <th className="p-4 text-left">Total</th>
                <th className="p-4 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {sessoes.map((sessao, index) => {
                const totalSessoes = sessao.sessoesDt
                  ? countSessions(sessao.sessoesDt)
                  : 0
                const totalValor = totalSessoes * sessao.valor

                return (
                  <tr key={index} className="border-b">
                    <td className="p-4">{sessao.pacienteInfo.nome}</td>
                    <td className="p-4">{sessao.pacienteInfo.responsavel}</td>
                    <td className="p-4">{formatCurrency(sessao.valor)}</td>
                    <td className="p-4">{sessao.notaFiscal ? 'Sim' : 'Não'}</td>
                    {sessao.sessoesDt &&
                      sessao.sessoesDt.map((data, index) => (
                        <React.Fragment key={index}>
                          <td className="p-4">{formatDate(data.dtSessao1)}</td>
                          <td className="p-4">{formatDate(data.dtSessao2)}</td>
                          <td className="p-4">{formatDate(data.dtSessao3)}</td>
                          <td className="p-4">{formatDate(data.dtSessao4)}</td>
                          <td className="p-4">{formatDate(data.dtSessao5)}</td>
                          <td className="p-4">{formatDate(data.dtSessao6)}</td>
                        </React.Fragment>
                      ))}
                    <td className="p-4">{formatCurrency(totalValor)}</td>
                    <td className="p-4 flex space-x-2">
                      <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => openPopup(sessao)}
                      >
                        <Eye size={20} weight="bold" />
                      </button>
                      <button className="text-green-500 hover:text-green-700">
                        <PencilSimple size={20} weight="bold" />
                      </button>
                      <button
                        onClick={() => handleDeleteSessao(sessao.id)}
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

      {isPopupOpen && selectedPaciente && (
        <PacienteDetalhes paciente={selectedPaciente} onClose={closePopup} />
      )}
      {isNovaSessaoOpen && (
        <NovaSessao
          isOpen={isNovaSessaoOpen}
          onAddSessao={addNovaSessao}
          onClose={closeNovaSessao}
        />
      )}
    </div>
  )
}
