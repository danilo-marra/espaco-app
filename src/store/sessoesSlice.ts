import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { SessoesState } from "./store";
import type { Sessao } from "../tipos";
import httpRequest, { API_URL } from "../utils/api";
import axios from "axios";
import { calculateTotals } from "./totalsSlice";

const initialState: SessoesState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchSessoes = createAsyncThunk<Sessao[]>(
  "sessoes/fetchSessoes",
  async (_, { dispatch }) => {
    const response = await httpRequest<Sessao[]>(`${API_URL}/sessoes`, "GET");
    dispatch(calculateTotals());
    return response;
  },
);

export const addSessao = createAsyncThunk<Sessao, Sessao>(
  "sessoes/addSessao",
  async (sessao, { dispatch }) => {
    const response = await httpRequest<Sessao>(
      `${API_URL}/sessoes`,
      "POST",
      sessao,
    );
    dispatch(calculateTotals());
    return response;
  },
);

// Thunk para editar sessao
export const updateSessao = createAsyncThunk<
  Sessao,
  Sessao,
  { rejectValue: string }
>("sessoes/updateSessao", async (sessao, { rejectWithValue, dispatch }) => {
  try {
    const updatedSessao = await httpRequest<Sessao>(
      `${API_URL}/sessoes/${sessao.id}`,
      "PUT",
      sessao,
    );
    dispatch(calculateTotals());
    // Add any additional dispatches if necessary
    // await dispatch(updateAgendaBySessao(updatedSessao))

    return updatedSessao;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Erro ao atualizar sessão:", error.message);
      return rejectWithValue(error.message);
    }
    return rejectWithValue("Erro desconhecido");
  }
});

// Thunk para deletar sessao
export const deleteSessao = createAsyncThunk<string, string>(
  "sessoes/deleteSessao",
  async (id, { dispatch }) => {
    await httpRequest(`${API_URL}/sessoes/${id}`, "DELETE");
    dispatch(calculateTotals());
    return id;
  },
);

const sessoesSlice = createSlice({
  name: "sessoes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSessoes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSessoes.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchSessoes.rejected, (state) => {
        state.loading = false;
        state.error = "Erro ao buscar sessoes";
      })
      .addCase(addSessao.fulfilled, (state, action: PayloadAction<Sessao>) => {
        state.data.push(action.payload);
      })
      .addCase(
        updateSessao.fulfilled,
        (state, action: PayloadAction<Sessao>) => {
          state.data = state.data.map((sessao) =>
            sessao.id === action.payload.id ? action.payload : sessao,
          );
        },
      )
      .addCase(
        deleteSessao.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.data = state.data.filter(
            (sessao) => sessao.id !== action.payload,
          );
        },
      );
  },
});

export default sessoesSlice.reducer;
