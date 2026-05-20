import { configureStore } from '@reduxjs/toolkit';
import roomReducer from '@/features/room/roomSlice';
import userReducer from '@/features/user/userSlice';
import queueReducer from '@/features/queue/queueSlice';
import playerReducer from '@/features/player/playerSlice';

export const store = configureStore({
  reducer: {
    room: roomReducer,
    user: userReducer,
    queue: queueReducer,
    player: playerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
