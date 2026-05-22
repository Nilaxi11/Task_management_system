import { createSlice, nanoid } from '@reduxjs/toolkit';
import { seedUsers } from '../../data/seed';

const colors = ['#1677ff','#52c41a','#fa8c16','#eb2f96','#722ed1','#13c2c2','#f5222d'];

const userSlice = createSlice({
  name: 'users',
  initialState: { list: seedUsers },
  reducers: {
    addUser: {
      reducer(state, { payload }) { state.list.push(payload); },
      prepare(data) {
        return { payload: { id: nanoid(), avatarColor: colors[Math.floor(Math.random()*colors.length)], ...data } };
      }
    },
    updateUser(state, { payload }) {
      const i = state.list.findIndex((u) => u.id === payload.id);
      if (i >= 0) state.list[i] = { ...state.list[i], ...payload };
    },
    deleteUser(state, { payload }) {
      state.list = state.list.filter((u) => u.id !== payload);
    },
  },
});

export const { addUser, updateUser, deleteUser } = userSlice.actions;
export default userSlice.reducer;
