"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchState {
  isOpen: boolean;
  query: string;
}

const initialState: SearchState = {
  isOpen: false,
  query: "",
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    openSearch(state) {
      state.isOpen = true;
    },
    closeSearch(state) {
      state.isOpen = false;
      state.query = "";
    },
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },
  },
});

export const { openSearch, closeSearch, setQuery } = searchSlice.actions;
export default searchSlice.reducer;
