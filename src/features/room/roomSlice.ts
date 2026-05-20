import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RoomState } from '@/types';

const initialState: RoomState = {
  venueId: 'bar-la-ultima',
  venueName: 'Bar La Última 🍻',
  venueAddress: 'Av. Picarte 1234, Valdivia',
  roomId: '42',
  table: '7',
  usersOnline: 48,
  totalVotes: 127,
  approvedCount: 21,
};

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    setRoom(state, action: PayloadAction<Partial<RoomState>>) {
      Object.assign(state, action.payload);
    },
    incrementVotes(state, amount: PayloadAction<number>) {
      state.totalVotes = Math.max(0, state.totalVotes + amount.payload);
    },
    incrementApproved(state) {
      state.approvedCount += 1;
    },
  },
});

export const { setRoom, incrementVotes, incrementApproved } = roomSlice.actions;
export default roomSlice.reducer;
