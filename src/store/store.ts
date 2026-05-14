import { configureStore } from "@reduxjs/toolkit";
import searchReducer from "./slices/searchSlice";
import continueReducer from "./slices/continueSlice";

export const store = configureStore({
  reducer: {
    search: searchReducer,
    continue: continueReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
