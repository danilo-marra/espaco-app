// store.ts
import { configureStore, createSelector } from '@reduxjs/toolkit'
import pacientesReducer from './pacientesSlice'
import terapeutasReducer from './terapeutasSlice'
import transacoesReducer from './transacoesSlice'
import sessoesReducer from './sessoesSlice'
import totalsReducer from './totalsSlice'
import agendamentosReducer from './agendamentosSlice'

import type {
  Paciente,
  Sessao,
  Terapeuta,
  Transacao,
  Agendamento,
} from '../tipos'
import { calculateRepasseInfo } from '@/utils/calculateRepasseInfo'

export interface TotalsState {
  totalValue: number
  totalRepasse: number
}

export interface PacientesState {
  data: Paciente[]
  loading: boolean
  error: string | null
}

export interface TerapeutasState {
  data: Terapeuta[]
  loading: boolean
  error: string | null
}

export interface TransacoesState {
  data: Transacao[]
  loading: boolean
  error: string | null
}

export interface SessoesState {
  data: Sessao[]
  loading: boolean
  error: string | null
}

export interface AgendamentosState {
  data: Agendamento[]
  loading: boolean
  error: string | null
}

interface Summary {
  entrada: number
  saida: number
  total: number
}

interface RootState {
  pacientes: PacientesState
  terapeutas: TerapeutasState
  transacoes: TransacoesState
  sessoes: SessoesState
  totals: TotalsState
  agendamentos: AgendamentosState
}

export const selectTransacoesSummary = (month: number, year: number) =>
  createSelector(
    [
      (state: RootState) => state.transacoes.data,
      (state: RootState) => state.sessoes.data,
    ],
    (transacoes: Transacao[], sessoes: Sessao[]): Summary => {
      const filteredTransacoes = transacoes.filter((transacao) => {
        const dataTransacao = new Date(transacao.dtCriacao)
        return (
          dataTransacao.getMonth() === month &&
          dataTransacao.getFullYear() === year
        )
      })

      const sessoesDoMes = sessoes.filter((sessao) => {
        const dataSessao = new Date(sessao.dtSessao1)
        return (
          dataSessao.getMonth() === month && dataSessao.getFullYear() === year
        )
      })

      const totaisMesAtual = sessoesDoMes.reduce(
        (acc, sessao) => {
          const calculations = calculateRepasseInfo(sessao)
          return {
            totalValue: acc.totalValue + calculations.totalValue,
            totalRepasse: acc.totalRepasse + calculations.repasseValue,
          }
        },
        { totalValue: 0, totalRepasse: 0 },
      )

      const totalSessoes: Transacao = {
        id: 'total-sessoes',
        descricao: 'Sessões',
        tipo: 'entrada',
        valor: totaisMesAtual.totalValue,
        dtCriacao: new Date(year, month),
      }

      const totalRepasse: Transacao = {
        id: 'total-repasses',
        descricao: 'Repasses',
        tipo: 'saida',
        valor: totaisMesAtual.totalRepasse,
        dtCriacao: new Date(year, month),
      }

      const allTransacoes = [...filteredTransacoes, totalSessoes, totalRepasse]

      return allTransacoes.reduce(
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
    },
  )

export const selectEnhancedTransacoes = (
  month: number,
  year: number,
  searchValue: string,
) =>
  createSelector(
    [
      (state: RootState) => state.transacoes.data,
      (state: RootState) => state.sessoes.data,
    ],
    (transacoes: Transacao[], sessoes: Sessao[]) => {
      // Filtrar transações do mês e ano especificados
      const filteredTransacoes = transacoes.filter((transacao) => {
        const dataTransacao = new Date(transacao.dtCriacao)
        return (
          dataTransacao.getMonth() === month &&
          dataTransacao.getFullYear() === year &&
          transacao.descricao.toLowerCase().includes(searchValue.toLowerCase())
        )
      })

      // Calcular totais de sessões e repasses (mesmo que antes)
      const sessoesDoMes = sessoes.filter((sessao) => {
        const dataSessao = new Date(sessao.dtSessao1)
        return (
          dataSessao.getMonth() === month && dataSessao.getFullYear() === year
        )
      })

      const totaisMesAtual = sessoesDoMes.reduce(
        (acc, sessao) => {
          const calculations = calculateRepasseInfo(sessao)
          return {
            totalValue: acc.totalValue + calculations.totalValue,
            totalRepasse: acc.totalRepasse + calculations.repasseValue,
          }
        },
        { totalValue: 0, totalRepasse: 0 },
      )

      const totalSessoes: Transacao = {
        id: 'total-sessoes',
        descricao: 'Sessões',
        tipo: 'entrada',
        valor: totaisMesAtual.totalValue,
        dtCriacao: new Date(year, month),
      }

      const totalRepasse: Transacao = {
        id: 'total-repasses',
        descricao: 'Repasses',
        tipo: 'saida',
        valor: totaisMesAtual.totalRepasse,
        dtCriacao: new Date(year, month),
      }

      // Combinar as transações filtradas com as transações virtuais
      const allTransacoes = [...filteredTransacoes, totalSessoes, totalRepasse]

      return allTransacoes
    },
  )

export const store = configureStore({
  reducer: {
    pacientes: pacientesReducer,
    terapeutas: terapeutasReducer,
    transacoes: transacoesReducer,
    sessoes: sessoesReducer,
    totals: totalsReducer,
    agendamentos: agendamentosReducer,
  },
})

export type { RootState }
export type AppDispatch = typeof store.dispatch
