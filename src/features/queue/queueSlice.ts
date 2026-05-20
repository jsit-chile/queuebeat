import { createSlice, type PayloadAction, nanoid } from '@reduxjs/toolkit';
import type { QueueRequest, Song } from '@/types';

interface QueueState {
  pending: QueueRequest[];
  approved: QueueRequest[];
}

const seedPending: QueueRequest[] = [
  {
    uid: 'seed_p_0',
    songId: 'aZJ7Aa4PiPM',
    title: 'Despacito (Karaoke)',
    artist: 'Luis Fonsi ft. Daddy Yankee',
    singer: 'Mesa 7',
    requestedBy: 'pato_vdv',
    votes: 9,
    ts: Date.now() - 60000,
    status: 'pending',
  },
  {
    uid: 'seed_p_1',
    songId: 'iuJDhFRDx9M',
    title: 'Uptown Funk — Karaoke',
    artist: 'Bruno Mars',
    singer: 'Florencia & Javier',
    requestedBy: 'flo_y',
    votes: 6,
    ts: Date.now() - 120000,
    status: 'pending',
  },
];

const seedApproved: QueueRequest[] = [
  {
    uid: 'seed_a_0',
    songId: 'pKlfdHLnVoY',
    title: 'Shape of You — Karaoke',
    artist: 'Ed Sheeran',
    singer: 'Mesa 3',
    requestedBy: 'lucia',
    votes: 12,
    ts: Date.now() - 600000,
    status: 'approved',
  },
  {
    uid: 'seed_a_1',
    songId: 'be1ld6lqxsk',
    title: 'Hello — Karaoke',
    artist: 'Adele',
    singer: 'Rafita',
    requestedBy: 'rafa',
    votes: 8,
    ts: Date.now() - 700000,
    status: 'approved',
  },
  {
    uid: 'seed_a_2',
    songId: 'h9zPaPJ5wWo',
    title: 'Roar — Karaoke',
    artist: 'Katy Perry',
    singer: 'Las cabras',
    requestedBy: 'cam',
    votes: 5,
    ts: Date.now() - 800000,
    status: 'approved',
  },
];

const initialState: QueueState = {
  pending: seedPending,
  approved: seedApproved,
};

const queueSlice = createSlice({
  name: 'queue',
  initialState,
  reducers: {
    submitRequest: {
      reducer(state, action: PayloadAction<QueueRequest>) {
        state.pending.unshift(action.payload);
      },
      prepare(payload: { song: Song; singer: string; requestedBy: string }) {
        return {
          payload: {
            uid: 'req_' + nanoid(8),
            songId: payload.song.id,
            title: payload.song.title,
            artist: payload.song.artist,
            singer: payload.singer,
            requestedBy: payload.requestedBy,
            votes: 1,
            ts: Date.now(),
            status: 'pending' as const,
          },
        };
      },
    },
    approveRequest(state, action: PayloadAction<string>) {
      const idx = state.pending.findIndex((r) => r.uid === action.payload);
      if (idx === -1) return;
      const req = state.pending.splice(idx, 1)[0];
      req.status = 'approved';
      state.approved.push(req);
    },
    rejectRequest(state, action: PayloadAction<string>) {
      state.pending = state.pending.filter((r) => r.uid !== action.payload);
    },
    removeFromApproved(state, action: PayloadAction<string>) {
      state.approved = state.approved.filter((r) => r.uid !== action.payload);
    },
    voteRequest(state, action: PayloadAction<{ uid: string; delta: number }>) {
      const { uid, delta } = action.payload;
      const target =
        state.pending.find((r) => r.uid === uid) ||
        state.approved.find((r) => r.uid === uid);
      if (target) {
        target.votes = Math.max(0, target.votes + delta);
        state.approved.sort((a, b) => b.votes - a.votes);
        state.pending.sort((a, b) => b.votes - a.votes);
      }
    },
    consumeNext(state, action: PayloadAction<string | undefined>) {
      // si pasan un uid concreto, sacamos ese; si no, el primero
      if (action.payload) {
        const idx = state.approved.findIndex((r) => r.uid === action.payload);
        if (idx !== -1) state.approved.splice(idx, 1);
      } else {
        state.approved.shift();
      }
    },
    addRandomVote(state) {
      if (state.approved.length === 0) return;
      const idx = Math.floor(Math.random() * state.approved.length);
      state.approved[idx].votes += 1;
      state.approved.sort((a, b) => b.votes - a.votes);
    },
  },
});

export const {
  submitRequest,
  approveRequest,
  rejectRequest,
  removeFromApproved,
  voteRequest,
  consumeNext,
  addRandomVote,
} = queueSlice.actions;
export default queueSlice.reducer;
