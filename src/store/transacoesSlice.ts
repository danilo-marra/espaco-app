import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit'
import type { Transacao } from '../tipos'
import type { TransacoesState } from './store'
import httpRequest, { API_URL } from '../utils/api'
import axios from 'axios'

// Estado inicial
const initialState: TransacoesState = {
  data: [],
  loading: false,
  error: null,
}

// Thunk para buscar transações
export const fetchTransacoes = createAsyncThunk<Transacao[]>(
  'transacoes/fetchTransacoes',
  async () => httpRequest<Transacao[]>(`${API_URL}/transacoes`, 'GET'),
)

// Thunk para adicionar transação
export const addTransacao = createAsyncThunk<Transacao, Transacao>(
  'transacoes/addTransacao',
  async (transacao) => {
    const response = await httpRequest<Transacao>(
      `${API_URL}/transacoes`,
      'POST',
      transacao,
    )
    return response
  },
)

// Thunk para atualizar transação
export const updateTransacao = createAsyncThunk<
  Transacao,
  Transacao,
  { rejectValue: string }
>('transacoes/updateTransacao', async (transacao, { rejectWithValue }) => {
  try {
    const updatedTransacao = await httpRequest<Transacao>(
      `${API_URL}/transacoes/${transacao.id}`,
      'PUT',
      transacao,
    )
    return updatedTransacao
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Erro ao atualizar transação:', error.message)
      return rejectWithValue(error.message)
    }
    if (error instanceof Error) {
      console.error('Erro ao atualizar transação:', error.message)
      return rejectWithValue(error.message)
    }

    console.error('Erro ao atualizar transação')
    return rejectWithValue('Erro ao atualizar transação')
  }
})

// Thunk para excluir transação
export const deleteTransacao = createAsyncThunk<string, string>(
  'transacoes/deleteTransacao',
  async (id) => {
    await httpRequest(`${API_URL}/transacoes/${id}`, 'DELETE')
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
