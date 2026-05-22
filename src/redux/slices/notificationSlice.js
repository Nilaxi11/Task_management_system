import { createSlice, nanoid } from '@reduxjs/toolkit';
import { seedNotifications } from '../../data/seed';

const slice = createSlice({
  name: 'notifications',
  initialState: { list: seedNotifications },
  reducers: {
    addNotification: {
      reducer(state, { payload }) { state.list.unshift(payload); },
      prepare(data) { return { payload: { id: nanoid(), at: Date.now(), read: false, ...data } }; }
    },
    markRead(state, { payload }) {
      const n = state.list.find((x) => x.id === payload);
      if (n) n.read = true;
    },
    markAllRead(state) { state.list.forEach((n) => (n.read = true)); },
    clearAll(state) { state.list = []; },
  },
});

export const { addNotification, markRead, markAllRead, clearAll } = slice.actions;
export default slice.reducer;
