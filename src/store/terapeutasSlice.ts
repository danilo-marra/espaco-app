import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit'
import type { Paciente, Terapeuta } from '../tipos'
import type { TerapeutasState } from './store'

// Estado inicial
const initialState: TerapeutasState = {
  data: [],
  loading: false,
  error: null,
}

// Thunk para buscar terapeutas
export const fetchTerapeutas = createAsyncThunk(
  'terapeutas/fetchTerapeutas',
  async () => {
    const response = await fetch('http://localhost:3000/terapeutas')
    return await response.json()
  },
)

// Thunk para adicionar terapeuta
export const addTerapeuta = createAsyncThunk(
  'terapeutas/addTerapeuta',
  async (terapeuta: Terapeuta) => {
    const response = await fetch('http://localhost:3000/terapeutas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(terapeuta),
    })
    return await response.json()
  },
)

// Thunk para editar terapeuta
export const updateTerapeuta = createAsyncThunk(
  'terapeutas/updateTerapeuta',
  async (terapeuta: Terapeuta, { dispatch }) => {
    const response = await fetch(
      `http://localhost:3000/terapeutas/${terapeuta.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(terapeuta),
      },
    )
    const updatedTerapeuta = await response.json()

    await dispatch(updatePacientesByTerapeuta(updatedTerapeuta))

    return updatedTerapeuta
  },
)

export const updatePacientesByTerapeuta = createAsyncThunk(
  'pacientes/updatePacientesByTerapeuta',
  async (terapeuta: Terapeuta) => {
    const response = await fetch('http://localhost:3000/pacientes')
    const pacientes: Paciente[] = await response.json()

    const pacientesAtualizados = pacientes
      .filter((paciente) => paciente.terapeutaInfo.id === terapeuta.id)
      .map((paciente) => ({
        ...paciente,
        terapeutaInfo: {
          ...paciente.terapeutaInfo,
          nomeTerapeuta: terapeuta.nomeTerapeuta,
        },
      }))

    // Atualizar pacientes no backend
    for (const paciente of pacientesAtualizados) {
      await fetch(`http://localhost:3000/pacientes/${paciente.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paciente),
      })
    }

    return pacientesAtualizados
  },
)

// Thunk para excluir terapeuta
export const deleteTerapeuta = createAsyncThunk(
  'terapeutas/deleteTerapeuta',
  async (id: string) => {
    await fetch(`http://localhost:3000/terapeutas/${id}`, {
      method: 'DELETE',
    })
    return id
  },
)

// Slice de Terapeutas
const terapeutasSlice = createSlice({
  name: 'terapeutas',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTerapeutas.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchTerapeutas.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchTerapeutas.rejected, (state) => {
        state.loading = false
        state.error = 'Erro ao buscar terapeutas'
      })
      .addCase(
        addTerapeuta.fulfilled,
        (state, action: PayloadAction<Terapeuta>) => {
          state.data.push(action.payload)
        },
      )
      .addCase(
        updateTerapeuta.fulfilled,
        (state, action: PayloadAction<Terapeuta>) => {
          state.data = state.data.map((terapeuta) =>
            terapeuta.id === action.payload.id ? action.payload : terapeuta,
          )
        },
      )
      .addCase(
        deleteTerapeuta.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.data = state.data.filter(
            (terapeuta) => terapeuta.id !== action.payload,
          )
        },
      )
  },
})

export default terapeutasSlice.reducer
