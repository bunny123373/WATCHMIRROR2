"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MyListItem {
  slug: string;
  type: "movie" | "series";
  title: string;
  poster: string;
  year?: number;
  quality?: string;
}

interface MyListState {
  items: MyListItem[];
}

const initialState: MyListState = {
  items: [],
};

const myListSlice = createSlice({
  name: "myList",
  initialState,
  reducers: {
    setMyList(state, action: PayloadAction<MyListItem[]>) {
      state.items = action.payload;
    },
    addToList(state, action: PayloadAction<MyListItem>) {
      if (!state.items.find((i) => i.slug === action.payload.slug)) {
        state.items.unshift(action.payload);
      }
    },
    removeFromList(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.slug !== action.payload);
    },
  },
});

export const { setMyList, addToList, removeFromList } = myListSlice.actions;
export default myListSlice.reducer;
