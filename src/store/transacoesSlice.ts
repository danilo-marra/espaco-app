// transacoesSlice.ts
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit'
import type { Transacao } from '../tipos'

interface TransacoesState {
  data: Transacao[]
  loading: boolean
  error: string | null
}

// Estado inicial
const initialState: TransacoesState = {
  data: [],
  loading: false,
  error: null,
}

// Thunk para buscar transações
export const fetchTransacoes = createAsyncThunk(
  'transacoes/fetchTransacoes',
  async () => {
    const response = await fetch('http://localhost:3000/transacoes')
    return await response.json()
  },
)

// Thunk para adicionar transação
export const addTransacao = createAsyncThunk(
  'transacoes/addTransacao',
  async (transacao: Transacao) => {
    const response = await fetch('http://localhost:3000/transacoes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transacao),
    })
    return await response.json()
  },
)

// Thunk para atualizar transação
export const updateTransacao = createAsyncThunk(
  'transacoes/updateTransacao',
  async (transacao: Transacao) => {
    const response = await fetch(
      `http://localhost:3000/transacoes/${transacao.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transacao),
      },
    )
    return await response.json()
  },
)

// Thunk para excluir transação
export const deleteTransacao = createAsyncThunk(
  'transacoes/deleteTransacao',
  async (id: string) => {
    await fetch(`http://localhost:3000/transacoes/${id}`, {
      method: 'DELETE',
    })
    return id
  },
)

// Slice de Transacoes
const transacoesSlice = createSlice({
  name: 'transacoes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransacoes.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchTransacoes.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchTransacoes.rejected, (state) => {
        state.loading = false
        state.error = 'Erro ao buscar transações'
      })
      .addCase(
        addTransacao.fulfilled,
        (state, action: PayloadAction<Transacao>) => {
          state.data.push(action.payload)
        },
      )
      .addCase(
        updateTransacao.fulfilled,
        (state, action: PayloadAction<Transacao>) => {
          const index = state.data.findIndex((t) => t.id === action.payload.id)
          if (index !== -1) {
            state.data[index] = action.payload
          }
        },
      )
      .addCase(
        deleteTransacao.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.data = state.data.filter((t) => t.id !== action.payload)
        },
      )
  },
})

export default transacoesSlice.reducer
