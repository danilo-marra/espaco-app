import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit'
import type { SessoesState } from './store'
import type { Sessao } from '../tipos'

const initialState: SessoesState = {
  data: [],
  loading: false,
  error: null,
}

export const fetchSessoes = createAsyncThunk(
  'sessoes/fetchSessoes',
  async () => {
    const response = await fetch('http://localhost:3000/sessoes')
    return await response.json()
  },
)

export const addSessao = createAsyncThunk(
  'sessoes/addSessao',
  async (sessao: Sessao) => {
    const response = await fetch('http://localhost:3000/sessoes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sessao),
    })
    return await response.json()
  },
)

export const updateSessao = createAsyncThunk(
  'sessoes/updateSessao',
  async (sessao: Sessao) => {
    const response = await fetch(`http://localhost:3000/sessoes/${sessao.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sessao),
    })
    return await response.json()
  },
)

export const deleteSessao = createAsyncThunk(
  'sessoes/deleteSessao',
  async (sessaoId: string) => {
    await fetch(`http://localhost:3000/sessoes/${sessaoId}`, {
      method: 'DELETE',
    })
    return sessaoId
  },
)

const sessoesSlice = createSlice({
  name: 'sessoes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSessoes.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchSessoes.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchSessoes.rejected, (state) => {
        state.loading = false
        state.error = 'Erro ao buscar sessoes'
      })
      .addCase(addSessao.fulfilled, (state, action: PayloadAction<Sessao>) => {
        state.data.push(action.payload)
      })
      .addCase(
        updateSessao.fulfilled,
        (state, action: PayloadAction<Sessao>) => {
          state.data = state.data.map((sessao) =>
            sessao.id === action.payload.id ? action.payload : sessao,
          )
        },
      )
      .addCase(
        deleteSessao.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.data = state.data.filter(
            (sessao) => sessao.id !== action.payload,
          )
        },
      )
  },
})

export default sessoesSlice.reducer
