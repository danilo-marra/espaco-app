// store.ts
import { configureStore } from '@reduxjs/toolkit'
import pacientesReducer from './pacientesSlice'
import terapeutasReducer from './terapeutasSlice'
import transacoesReducer from './transacoesSlice'
import sessoesReducer from './sessoesSlice'

import type { Paciente, Sessao, Terapeuta, Transacao } from '../tipos'

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
}

export const store = configureStore({
  reducer: {
    pacientes: pacientesReducer,
    terapeutas: terapeutasReducer,
    transacoes: transacoesReducer,
    sessoes: sessoesReducer,
  },
})

export type { RootState }
export type AppDispatch = typeof store.dispatch
