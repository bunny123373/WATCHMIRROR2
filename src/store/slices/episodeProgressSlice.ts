"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WatchedEpisode {
  slug: string;
  seasonNumber: number;
  episodeNumber: number;
  watchedAt: number;
}

interface EpisodeProgressState {
  watched: WatchedEpisode[];
}

const initialState: EpisodeProgressState = {
  watched: [],
};

const episodeProgressSlice = createSlice({
  name: "episodeProgress",
  initialState,
  reducers: {
    setWatchedEpisodes(state, action: PayloadAction<WatchedEpisode[]>) {
      state.watched = action.payload;
    },
    markEpisodeWatched(state, action: PayloadAction<WatchedEpisode>) {
      const existing = state.watched.findIndex(
        (w) =>
          w.slug === action.payload.slug &&
          w.seasonNumber === action.payload.seasonNumber &&
          w.episodeNumber === action.payload.episodeNumber
      );
      if (existing >= 0) {
        state.watched[existing] = action.payload;
      } else {
        state.watched.push(action.payload);
      }
    },
    clearSeriesProgress(state, action: PayloadAction<string>) {
      state.watched = state.watched.filter((w) => w.slug !== action.payload);
    },
  },
});

export const { setWatchedEpisodes, markEpisodeWatched, clearSeriesProgress } = episodeProgressSlice.actions;
export default episodeProgressSlice.reducer;
