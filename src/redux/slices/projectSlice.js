import { createSlice, nanoid } from '@reduxjs/toolkit';
import { seedProjects } from '../../data/seed';

const projectSlice = createSlice({
  name: 'projects',
  initialState: { list: seedProjects },
  reducers: {
    addProject: {
      reducer(state, { payload }) { state.list.push(payload); },
      prepare(data) { return { payload: { id: nanoid(), progress: 0, status: 'Todo', members: [], ...data } }; }
    },
    updateProject(state, { payload }) {
      const i = state.list.findIndex((p) => p.id === payload.id);
      if (i >= 0) state.list[i] = { ...state.list[i], ...payload };
    },
    deleteProject(state, { payload }) {
      state.list = state.list.filter((p) => p.id !== payload);
    },
  },
});

export const { addProject, updateProject, deleteProject } = projectSlice.actions;
export default projectSlice.reducer;
