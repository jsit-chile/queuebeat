import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { PlayerState, QueueRequest } from '@/types';

const initialState: PlayerState = {
  currentSongId: null,
  currentRequest: null,
  isPlaying: false,
  volume: 70,
  progress: 0,
  errorCode: null,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setCurrent(state, action: PayloadAction<QueueRequest | null>) {
      state.currentRequest = action.payload;
      state.currentSongId = action.payload?.songId ?? null;
      state.errorCode = null;
      state.progress = 0;
    },
    setPlaying(state, action: PayloadAction<boolean>) {
      state.isPlaying = action.payload;
    },
    setVolume(state, action: PayloadAction<number>) {
      state.volume = Math.max(0, Math.min(100, action.payload));
    },
    setProgress(state, action: PayloadAction<number>) {
      state.progress = action.payload;
    },
    setError(state, action: PayloadAction<number | null>) {
      state.errorCode = action.payload;
    },
    clearPlayer(state) {
      state.currentRequest = null;
      state.currentSongId = null;
      state.isPlaying = false;
      state.progress = 0;
    },
  },
});

export const { setCurrent, setPlaying, setVolume, setProgress, setError, clearPlayer } =
  playerSlice.actions;
export default playerSlice.reducer;
