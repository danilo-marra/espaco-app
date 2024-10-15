// pacientesSlice.ts
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit'
import type { Paciente } from '../tipos'

interface PacientesState {
  data: Paciente[]
  loading: boolean
  error: string | null
}

// Estado inicial
const initialState: PacientesState = {
  data: [],
  loading: false,
  error: null,
}

// Thunk para buscar pacientes
export const fetchPacientes = createAsyncThunk(
  'pacientes/fetchPacientes',
  async () => {
    const response = await fetch('http://localhost:3000/pacientes')
    return await response.json()
  },
)

// Slice de Pacientes
const pacientesSlice = createSlice({
  name: 'pacientes',
  initialState,
  reducers: {
    updatePaciente: (state, action: PayloadAction<Paciente>) => {
      const index = state.data.findIndex((p) => p.id === action.payload.id)
      if (index !== -1) {
        state.data[index] = action.payload
      }
    },
    addPaciente: (state, action: PayloadAction<Paciente>) => {
      state.data.push(action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPacientes.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchPacientes.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchPacientes.rejected, (state) => {
        state.loading = false
        state.error = 'Erro ao buscar pacientes'
      })
  },
})

export const { updatePaciente, addPaciente } = pacientesSlice.actions
export default pacientesSlice.reducer
