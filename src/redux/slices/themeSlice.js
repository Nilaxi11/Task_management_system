import { createSlice } from '@reduxjs/toolkit';
const slice = createSlice({
  name: 'theme',
  initialState: { mode: 'light', sidebarCollapsed: false },
  reducers: {
    toggleTheme(state) { state.mode = state.mode === 'light' ? 'dark' : 'light'; },
    setTheme(state, { payload }) { state.mode = payload; },
    toggleSidebar(state) { state.sidebarCollapsed = !state.sidebarCollapsed; },
    resetApp() { localStorage.removeItem('taskflow_state'); window.location.reload(); },
  },
});
export const { toggleTheme, setTheme, toggleSidebar, resetApp } = slice.actions;
export default slice.reducer;
