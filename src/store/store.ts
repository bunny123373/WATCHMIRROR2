import { configureStore } from "@reduxjs/toolkit";
import searchReducer from "./slices/searchSlice";
import continueReducer from "./slices/continueSlice";
import myListReducer from "./slices/myListSlice";
import episodeProgressReducer from "./slices/episodeProgressSlice";

export const store = configureStore({
  reducer: {
    search: searchReducer,
    continue: continueReducer,
    myList: myListReducer,
    episodeProgress: episodeProgressReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
