import httpRequest, { API_URL } from '@/utils/api'
import type { AgendamentosState } from './store'
import type { Agendamento } from '@/tipos'
import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit'
import axios from 'axios'

const initialState: AgendamentosState = {
  data: [],
  loading: false,
  error: null,
}

export const fetchAgendamentos = createAsyncThunk<Agendamento[]>(
  'agendamentos/fetchAgendamentos',
  async () => httpRequest<Agendamento[]>(`${API_URL}/agendamentos`, 'GET'),
)

export const addAgendamento = createAsyncThunk<Agendamento, Agendamento>(
  'agendamentos/addAgendamento',
  async (agendamento) =>
    httpRequest<Agendamento>(`${API_URL}/agendamentos`, 'POST', agendamento),
)

export const updateAgendamento = createAsyncThunk<
  Agendamento,
  Agendamento,
  { rejectValue: string }
>(
  'agendamentos/updateAgendamento',
  async (agendamento, { rejectWithValue }) => {
    try {
      const updatedAgendamento = await httpRequest<Agendamento>(
        `${API_URL}/agendamentos/${agendamento.id}`,
        'PUT',
        agendamento,
      )

      return updatedAgendamento
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Erro ao atualizar agendamento:', error.message)
        return rejectWithValue(error.message)
      }
      return rejectWithValue('Erro desconhecido')
    }
  },
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
      .addCase(
        addAgendamento.fulfilled,
        (state, action: PayloadAction<Agendamento>) => {
          state.data.push(action.payload)
        },
      )
      .addCase(
        updateAgendamento.fulfilled,
        (state, action: PayloadAction<Agendamento>) => {
          state.data = state.data.map((agendamento) =>
            agendamento.id === action.payload.id ? action.payload : agendamento,
          )
        },
      )
  },
})

export default agendamentosSlice.reducer
