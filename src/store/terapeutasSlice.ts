// terapeutasSlice.ts
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit'
import type { Terapeuta } from '../tipos'

interface TerapeutasState {
  data: Terapeuta[]
  loading: boolean
  error: string | null
}

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
  async (terapeuta: Terapeuta) => {
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
    return await response.json()
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
