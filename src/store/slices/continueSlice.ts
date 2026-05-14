"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ContinueWatchingItem } from "@/types";

interface ContinueState {
  items: ContinueWatchingItem[];
}

const initialState: ContinueState = {
  items: [],
};

const continueSlice = createSlice({
  name: "continue",
  initialState,
  reducers: {
    setContinueWatching(state, action: PayloadAction<ContinueWatchingItem[]>) {
      state.items = action.payload;
    },
    addContinueWatching(state, action: PayloadAction<ContinueWatchingItem>) {
      const existing = state.items.findIndex(
        (i) =>
          i.slug === action.payload.slug &&
          i.seasonNumber === action.payload.seasonNumber &&
          i.episodeNumber === action.payload.episodeNumber
      );
      if (existing >= 0) {
        state.items[existing] = action.payload;
      } else {
        state.items.unshift(action.payload);
        if (state.items.length > 10) {
          state.items = state.items.slice(0, 10);
        }
      }
    },
    removeContinueWatching(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.slug !== action.payload);
    },
  },
});

export const { setContinueWatching, addContinueWatching, removeContinueWatching } = continueSlice.actions;
export default continueSlice.reducer;
