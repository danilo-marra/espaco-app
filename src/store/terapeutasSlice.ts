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

// Slice de Terapeutas
const terapeutasSlice = createSlice({
  name: 'terapeutas',
  initialState,
  reducers: {
    updateTerapeuta: (state, action: PayloadAction<Terapeuta>) => {
      const index = state.data.findIndex((t) => t.id === action.payload.id)
      if (index !== -1) {
        state.data[index] = action.payload
      }
    },
  },
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
  },
})

export const { updateTerapeuta } = terapeutasSlice.actions
export default terapeutasSlice.reducer
