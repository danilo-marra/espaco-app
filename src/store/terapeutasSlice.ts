import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit'
import axios from 'axios'
import type { Sessao, Paciente, Terapeuta } from '../tipos'
import type { TerapeutasState } from './store'
import httpRequest, { API_URL } from '../utils/api'

// Estado inicial
const initialState: TerapeutasState = {
  data: [],
  loading: false,
  error: null,
}

// Thunk para buscar terapeutas
export const fetchTerapeutas = createAsyncThunk<Terapeuta[]>(
  'terapeutas/fetchTerapeuta',
  async () => httpRequest<Terapeuta[]>(`${API_URL}/terapeutas`, 'GET'),
)

// Thunk para adicionar terapeuta
export const addTerapeuta = createAsyncThunk<Terapeuta, Terapeuta>(
  'terapeutas/addTerapeuta',
  async (terapeuta) => {
    const response = await httpRequest<Terapeuta>(
      `${API_URL}/terapeutas`,
      'POST',
      terapeuta,
    )
    console.log('Terapeuta adicionado:', terapeuta)
    return response
  },
)

// Thunk para editar terapeuta
export const updateTerapeuta = createAsyncThunk<
  Terapeuta,
  Terapeuta,
  { rejectValue: string }
>(
  'terapeutas/updateTerapeuta',
  async (terapeuta, { dispatch, rejectWithValue }) => {
    try {
      const updatedTerapeuta = await httpRequest<Terapeuta>(
        `${API_URL}/terapeutas/${terapeuta.id}`,
        'PUT',
        terapeuta,
      )
      await dispatch(updatePacientesByTerapeuta(updatedTerapeuta))
      await dispatch(updateSessoesByTerapeuta(updatedTerapeuta))

      return updatedTerapeuta
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Erro ao atualizar terapeuta:', error.message)
        return rejectWithValue(error.message)
      }
      return rejectWithValue('Erro desconhecido')
    }
  },
)

// Thunk para atualizar pacientes relacionados
export const updatePacientesByTerapeuta = createAsyncThunk<
  Paciente[],
  Terapeuta,
  { rejectValue: string }
>(
  'pacientes/updatePacientesByTerapeuta',
  async (terapeuta, { rejectWithValue }) => {
    try {
      const pacientes = await httpRequest<Paciente[]>(
        `${API_URL}/pacientes`,
        'GET',
      )

      const pacientesAtualizados = pacientes
        .filter((p) => p.terapeutaInfo.id === terapeuta.id)
        .map((p) => ({
          ...p,
          terapeutaInfo: {
            ...p.terapeutaInfo,
            nomeTerapeuta: terapeuta.nomeTerapeuta,
          },
        }))

      await Promise.all(
        pacientesAtualizados.map((p) =>
          httpRequest<Paciente>(`${API_URL}/pacientes/${p.id}`, 'PUT', p),
        ),
      )

      console.log(
        'Pacientes que foram afetados pela atualização',
        pacientesAtualizados,
      )
      return pacientesAtualizados
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Erro ao atualizar pacientes:', error.message)
        return rejectWithValue(error.message)
      }
      return rejectWithValue('Erro desconhecido')
    }
  },
)

// Thunk para atualizar sessões relacionadas
export const updateSessoesByTerapeuta = createAsyncThunk<
  Sessao[],
  Terapeuta,
  { rejectValue: string }
>(
  'sessoes/updateSessoesByTerapeuta',
  async (terapeuta, { rejectWithValue }) => {
    try {
      const sessoes = await httpRequest<Sessao[]>(`${API_URL}/sessoes`, 'GET')

      const sessoesAtualizadas = sessoes
        .filter((s) => s.terapeutaInfo.id === terapeuta.id)
        .map((s) => ({
          ...s,
          terapeutaInfo: {
            ...s.terapeutaInfo,
            nomeTerapeuta: terapeuta.nomeTerapeuta,
          },
        }))

      await Promise.all(
        sessoesAtualizadas.map((s) =>
          httpRequest<Sessao>(`${API_URL}/sessoes/${s.id}`, 'PUT', s),
        ),
      )

      console.log(
        'Sessões que foram afetadas pela atualização',
        sessoesAtualizadas,
      )

      return sessoesAtualizadas
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Erro ao atualizar sessões:', error.message)
        return rejectWithValue(error.message)
      }
      return rejectWithValue('Erro desconhecido')
    }
  },
)

// Thunk para excluir terapeuta
export const deleteTerapeuta = createAsyncThunk<string, string>(
  'terapeutas/deleteTerapeuta',
  async (id) => {
    await httpRequest<void>(`${API_URL}/terapeutas/${id}`, 'DELETE')
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
      .addCase(fetchTerapeutas.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Erro ao buscar terapeutas'
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
