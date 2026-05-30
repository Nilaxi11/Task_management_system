import { createSlice } from '@reduxjs/toolkit';
import { seedUsers } from '../../data/seed';

const initialState = {
  currentUser: null,
  remember: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, { payload }) {
      state.currentUser = payload.user;
      state.remember = !!payload.remember;
    },

    logout(state) 
    { state.currentUser = null; },

    updateProfile(state, { payload }) {
      if (state.currentUser) state.currentUser = { ...state.currentUser, ...payload };
    },
  },
});

export const { login, logout, updateProfile } = authSlice.actions;
export default authSlice.reducer;

export const attemptLogin = ({ email, password, remember }) => (dispatch, getState) => {
  const users = getState().users.list;
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  if (!user) throw new Error('Invalid email or password');
  dispatch(login({ user, remember }));
  return user;
};
