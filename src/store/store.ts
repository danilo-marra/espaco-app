// store.ts
import { configureStore } from '@reduxjs/toolkit'
import pacientesReducer from './pacientesSlice'
import terapeutasReducer from './terapeutasSlice'
import transacoesReducer from './transacoesSlice'

export const store = configureStore({
  reducer: {
    pacientes: pacientesReducer,
    terapeutas: terapeutasReducer,
    transacoes: transacoesReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
