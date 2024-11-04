import httpRequest, { API_URL } from '@/utils/api'
import type { AgendamentosState } from './store'
import type { Agendamento } from '@/tipos'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const initialState: AgendamentosState = {
  data: [],
  loading: false,
  error: null,
}

export const fetchAgendamentos = createAsyncThunk<Agendamento[]>(
  'agendamentos/fetchAgendamentos',
  async () => httpRequest<Agendamento[]>(`${API_URL}/agendamentos`, 'GET'),
)

const agendamentosSlice = createSlice({
  name: 'agendamentos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAgendamentos.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchAgendamentos.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchAgendamentos.rejected, (state) => {
        state.loading = false
        state.error = 'Erro ao buscar agendamentos'
      })
  },
})

export default agendamentosSlice.reducer
