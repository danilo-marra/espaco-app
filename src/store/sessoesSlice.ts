import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { SessoesState } from './store'
import type { Sessao } from '../tipos'
import httpRequest, { API_URL } from '../utils/api'

const initialState: SessoesState = {
  data: [],
  loading: false,
  error: null,
}

export const fetchSessoes = createAsyncThunk<Sessao[]>(
  'sessoes/fetchSessoes',
  async () => httpRequest<Sessao[]>(`${API_URL}/sessoes`, 'GET'),
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
  },
})

export default sessoesSlice.reducer
