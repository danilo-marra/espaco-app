import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";
import type { Sessao, Paciente, Terapeuta } from "../tipos";
import type { TerapeutasState } from "./store";
import httpRequest, { API_URL } from "../utils/api";

// Estado inicial
const initialState: TerapeutasState = {
  data: [],
  loading: false,
  error: null,
};

// Thunk para buscar terapeutas
export const fetchTerapeutas = createAsyncThunk<Terapeuta[]>(
  "terapeutas/fetchTerapeuta",
  async () => httpRequest<Terapeuta[]>(`${API_URL}/terapeutas`, "GET"),
);

// Thunk para adicionar terapeuta
export const addTerapeuta = createAsyncThunk<Terapeuta, Terapeuta>(
  "terapeutas/addTerapeuta",
  async (terapeuta) => {
    const response = await httpRequest<Terapeuta>(
      `${API_URL}/terapeutas`,
      "POST",
      terapeuta,
    );
    // console.log('Terapeuta adicionado:', terapeuta)
    return response;
  },
);

// Thunk para editar terapeuta
export const updateTerapeuta = createAsyncThunk<
  Terapeuta,
  Terapeuta,
  { rejectValue: string }
>(
  "terapeutas/updateTerapeuta",
  async (terapeuta, { dispatch, rejectWithValue }) => {
    try {
      const updatedTerapeuta = await httpRequest<Terapeuta>(
        `${API_URL}/terapeutas/${terapeuta.id}`,
        "PUT",
        terapeuta,
      );
      await dispatch(updatePacientesByTerapeuta(updatedTerapeuta));
      await dispatch(updateSessoesByTerapeuta(updatedTerapeuta));

      return updatedTerapeuta;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Erro ao atualizar terapeuta:", error.message);
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Erro desconhecido");
    }
  },
);

// Thunk para atualizar pacientes relacionados
export const updatePacientesByTerapeuta = createAsyncThunk<
  Paciente[],
  Terapeuta,
  { rejectValue: string }
>(
  "pacientes/updatePacientesByTerapeuta",
  async (terapeuta: Terapeuta, { rejectWithValue }): Promise<Paciente[]> => {
    try {
      const pacientes = await httpRequest<Paciente[]>(
        `${API_URL}/pacientes`,
        "GET",
      );

      // Filtrar apenas os pacientes que têm o terapeuta específico
      const pacientesRelacionados = pacientes.filter(
        (paciente) => paciente.terapeutaInfo.id === terapeuta.id,
      );

      // Atualizar os pacientes relacionados
      const pacientesAtualizados = pacientesRelacionados.map((paciente) => ({
        ...paciente,
        terapeutaInfo: {
          ...paciente.terapeutaInfo,
          nomeTerapeuta: terapeuta.nomeTerapeuta,
        },
      }));

      await Promise.all(
        pacientesAtualizados.map((paciente) =>
          httpRequest<Paciente>(
            `${API_URL}/pacientes/${paciente.id}`,
            "PUT",
            paciente,
          ),
        ),
      );

      console.log(
        "Pacientes que foram afetados pela atualização",
        pacientesAtualizados,
      );
      return pacientesAtualizados;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Erro ao atualizar pacientes:", error.message);
        return Promise.reject(rejectWithValue(error.message));
      }
      return Promise.reject(rejectWithValue("Erro desconhecido"));
    }
  },
);

// Thunk para atualizar sessões relacionadas
export const updateSessoesByTerapeuta = createAsyncThunk<
  Sessao[],
  Terapeuta,
  { rejectValue: string }
>(
  "sessoes/updateSessoesByTerapeuta",
  async (terapeuta: Terapeuta, { rejectWithValue }): Promise<Sessao[]> => {
    try {
      const sessoes = await httpRequest<Sessao[]>(`${API_URL}/sessoes`, "GET");

      // Filtrar apenas as sessões que têm o terapeuta específico
      const sessoesRelacionadas = sessoes.filter(
        (sessao) => sessao.terapeutaInfo.id === terapeuta.id,
      );

      const sessoesAtualizadas = sessoesRelacionadas.map((sessao) => {
        return {
          ...sessao,
          terapeutaInfo: {
            ...sessao.terapeutaInfo,
            nomeTerapeuta: terapeuta.nomeTerapeuta,
            dtEntrada: terapeuta.dtEntrada,
          },
        };
      });

      await Promise.all(
        sessoesAtualizadas.map((sessao) =>
          httpRequest<Sessao>(`${API_URL}/sessoes/${sessao.id}`, "PUT", sessao),
        ),
      );

      console.log(
        "Sessões que foram afetadas pela atualização:",
        sessoesAtualizadas,
      );

      return sessoesAtualizadas;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Erro ao atualizar sessões:", error.message);
        return Promise.reject(rejectWithValue(error.message));
      }
      return Promise.reject(rejectWithValue("Erro desconhecido"));
    }
  },
);

// Thunk para excluir terapeuta
export const deleteTerapeuta = createAsyncThunk<string, string>(
  "terapeutas/deleteTerapeuta",
  async (id) => {
    await httpRequest<void>(`${API_URL}/terapeutas/${id}`, "DELETE");
    return id;
  },
);

// Slice de Terapeutas
const terapeutasSlice = createSlice({
  name: "terapeutas",
  initialState,
  reducers: {
    updateTerapeuta: (state, action: PayloadAction<Terapeuta>) => {
      const index = state.data.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.data[index] = action.payload; // Atualiza todo o objeto, incluindo 'foto'
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTerapeutas.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTerapeutas.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchTerapeutas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Erro ao buscar terapeutas";
      })
      .addCase(
        addTerapeuta.fulfilled,
        (state, action: PayloadAction<Terapeuta>) => {
          state.data.push(action.payload);
        },
      )
      .addCase(
        updateTerapeuta.fulfilled,
        (state, action: PayloadAction<Terapeuta>) => {
          state.data = state.data.map((terapeuta) =>
            terapeuta.id === action.payload.id ? action.payload : terapeuta,
          );
        },
      )
      .addCase(
        deleteTerapeuta.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.data = state.data.filter(
            (terapeuta) => terapeuta.id !== action.payload,
          );
        },
      );
  },
});

export default terapeutasSlice.reducer;
