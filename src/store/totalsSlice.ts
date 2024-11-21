import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { calculateRepasseInfo } from "../utils/calculateRepasseInfo";
import type { RootState } from "./store";

interface TotalsState {
  totalValue: number;
  totalRepasse: number;
}

const initialState: TotalsState = {
  totalValue: 0,
  totalRepasse: 0,
};

export const calculateTotals = createAsyncThunk(
  "totals/calculateTotals",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const sessoes = state.sessoes.data;

    const totals = sessoes.reduce(
      (acc, sessao) => {
        const calculations = calculateRepasseInfo(sessao);
        return {
          totalValue: acc.totalValue + calculations.totalValue,
          totalRepasse: acc.totalRepasse + calculations.repasseValue,
        };
      },
      { totalValue: 0, totalRepasse: 0 },
    );

    return totals;
  },
);

const totalsSlice = createSlice({
  name: "totals",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(calculateTotals.fulfilled, (state, action) => {
      state.totalValue = action.payload.totalValue;
      state.totalRepasse = action.payload.totalRepasse;
    });
  },
});

export default totalsSlice.reducer;
