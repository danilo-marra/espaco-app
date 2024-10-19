import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit'
import type { PacientesState } from './store'
import type { Paciente } from '../tipos'

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

// Thunk para adicionar paciente
export const addPaciente = createAsyncThunk(
  'pacientes/addPaciente',
  async (paciente: Paciente) => {
    const response = await fetch('http://localhost:3000/pacientes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paciente),
    })
    return await response.json()
  },
)

// Thunk para editar paciente
export const updatePaciente = createAsyncThunk(
  'pacientes/updatePaciente',
  async (paciente: Paciente) => {
    const response = await fetch(
      `http://localhost:3000/pacientes/${paciente.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paciente),
      },
    )
    return await response.json()
  },
)

// Thunk para excluir paciente
export const deletePaciente = createAsyncThunk(
  'pacientes/deletePaciente',
  async (id: string) => {
    await fetch(`http://localhost:3000/pacientes/${id}`, {
      method: 'DELETE',
    })
    return id
  },
)

// Slice de Pacientes
const pacientesSlice = createSlice({
  name: 'pacientes',
  initialState,
  reducers: {},
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
      .addCase(
        addPaciente.fulfilled,
        (state, action: PayloadAction<Paciente>) => {
          state.data.push(action.payload)
        },
      )
      .addCase(
        updatePaciente.fulfilled,
        (state, action: PayloadAction<Paciente>) => {
          state.data = state.data.map((paciente) =>
            paciente.id === action.payload.id ? action.payload : paciente,
          )
        },
      )
      .addCase(
        deletePaciente.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.data = state.data.filter(
            (paciente) => paciente.id !== action.payload,
          )
        },
      )
  },
})

export default pacientesSlice.reducer
