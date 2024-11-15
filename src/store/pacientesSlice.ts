import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit'
import type { PacientesState } from './store'
import type { Sessao, Paciente } from '../tipos'
import httpRequest, { API_URL } from '../utils/api'
import axios from 'axios'

// Estado inicial
const initialState: PacientesState = {
  data: [],
  loading: false,
  error: null,
  estatisticas: {
    novosPacientes: 0,
    novosPacientesMesAnterior: 0,
    percentualCrescimento: 0,
    pacientesPorMes: [],
  },
}

const calcularPacientesPorMes = (pacientes: Paciente[]): number[] => {
  const pacientesPorMes = new Array(12).fill(0)

  pacientes.forEach((paciente) => {
    const dtEntrada = new Date(paciente.dtEntradaPaciente)
    const mes = dtEntrada.getMonth()
    const ano = dtEntrada.getFullYear()

    // Só conta pacientes do ano atual
    if (ano === new Date().getFullYear()) {
      pacientesPorMes[mes]++
    }
  })

  return pacientesPorMes
}

// Thunk para buscar pacientes
export const fetchPacientes = createAsyncThunk<Paciente[]>(
  'pacientes/fetchPacientes',
  async () => {
    const response = await httpRequest<Paciente[]>(
      `${API_URL}/pacientes`,
      'GET',
    )
    return response
  },
)

// Thunk para adicionar paciente
export const addPaciente = createAsyncThunk<Paciente, Paciente>(
  'pacientes/addPaciente',
  async (paciente) => {
    const response = await httpRequest<Paciente>(
      `${API_URL}/pacientes`,
      'POST',
      paciente,
    )
    // console.log('Paciente adicionado:', paciente)
    return response
  },
)

// Thunk para editar paciente
export const updatePaciente = createAsyncThunk<
  Paciente,
  Paciente,
  { rejectValue: string }
>(
  'pacientes/updatePaciente',
  async (paciente, { dispatch, rejectWithValue }) => {
    try {
      const updatedPaciente = await httpRequest<Paciente>(
        `${API_URL}/pacientes/${paciente.id}`,
        'PUT',
        paciente,
      )
      await dispatch(updateSessoesByPaciente(updatedPaciente))

      // console.log('Paciente atualizado:', updatedPaciente)

      return updatedPaciente
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Erro ao atualizar paciente:', error.message)
        return Promise.reject(rejectWithValue(error.message))
      }
      return rejectWithValue('Erro desconhecido') as ReturnType<
        typeof rejectWithValue
      >
    }
  },
)

const calcularPercentualCrescimento = (
  atual: number,
  anterior: number,
): number => {
  if (anterior === 0) return atual > 0 ? 100 : 0
  return Math.round(((atual - anterior) / anterior) * 100)
}

// Thunk para atualizar sessões relacionadas
export const updateSessoesByPaciente = createAsyncThunk<
  Sessao[],
  Paciente,
  { rejectValue: string }
>(
  'sessoes/updateSessoesByPaciente',
  async (paciente: Paciente, { rejectWithValue }): Promise<Sessao[]> => {
    try {
      const sessoes = await httpRequest<Sessao[]>(`${API_URL}/sessoes`, 'GET')

      const sessoesAtualizadas = sessoes.map((sessao) => {
        if (sessao.pacienteInfo.id === paciente.id) {
          return { ...sessao, pacienteInfo: paciente }
        }
        return sessao
      })

      await Promise.all(
        sessoesAtualizadas.map((sessao) =>
          httpRequest<Sessao>(`${API_URL}/sessoes/${sessao.id}`, 'PUT', sessao),
        ),
      )
      // console.log(
      //   'Sessões que foram afetadas pela atualização:',
      //   sessoesAtualizadas,
      // )

      return sessoesAtualizadas
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Erro ao atualizar sessões:', error.message)
        return Promise.reject(rejectWithValue(error.message))
      }
      throw rejectWithValue('Erro desconhecido')
    }
  },
)

// Thunk para excluir paciente
export const deletePaciente = createAsyncThunk<string, string>(
  'pacientes/deletePaciente',
  async (id) => {
    await httpRequest(`${API_URL}/pacientes/${id}`, 'DELETE')
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

        // Calcula estatísticas
        const pacientesPorMes = calcularPacientesPorMes(action.payload)
        const mesAtual = new Date().getMonth()

        state.estatisticas = {
          novosPacientes: pacientesPorMes[mesAtual],
          novosPacientesMesAnterior:
            mesAtual > 0 ? pacientesPorMes[mesAtual - 1] : pacientesPorMes[11],
          percentualCrescimento: calcularPercentualCrescimento(
            pacientesPorMes[mesAtual],
            mesAtual > 0 ? pacientesPorMes[mesAtual - 1] : pacientesPorMes[11],
          ),
          pacientesPorMes,
        }
      })
      .addCase(fetchPacientes.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Erro ao buscar pacientes'
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
