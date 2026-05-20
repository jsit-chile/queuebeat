import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { UserState } from '@/types';

const initialState: UserState = {
  nickname: 'usuario_34',
  isJoined: false,
  votedRequests: {},
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    join(state, action: PayloadAction<string>) {
      state.nickname = action.payload || state.nickname;
      state.isJoined = true;
    },
    leave(state) {
      state.isJoined = false;
    },
    toggleVote(state, action: PayloadAction<string>) {
      const uid = action.payload;
      state.votedRequests[uid] = !state.votedRequests[uid];
    },
  },
});

export const { join, leave, toggleVote } = userSlice.actions;
export default userSlice.reducer;
