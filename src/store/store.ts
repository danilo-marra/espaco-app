// store.ts
import { configureStore } from '@reduxjs/toolkit'
import pacientesReducer from './pacientesSlice'
import terapeutasReducer from './terapeutasSlice'
import transacoesReducer from './transacoesSlice'
import sessoesReducer from './sessoesSlice'
import totalsReducer from './totalsSlice'

import type { Paciente, Sessao, Terapeuta, Transacao } from '../tipos'

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

interface RootState {
  pacientes: PacientesState
  terapeutas: TerapeutasState
  transacoes: TransacoesState
  sessoes: SessoesState
  totals: TotalsState
}

export const store = configureStore({
  reducer: {
    pacientes: pacientesReducer,
    terapeutas: terapeutasReducer,
    transacoes: transacoesReducer,
    sessoes: sessoesReducer,
    totals: totalsReducer,
  },
})

export type { RootState }
export type AppDispatch = typeof store.dispatch
