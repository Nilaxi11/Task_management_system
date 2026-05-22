import { createSlice, nanoid } from '@reduxjs/toolkit';
import { seedTasks } from '../../data/seed';

const taskSlice = createSlice({
  name: 'tasks',
  initialState: { list: seedTasks },
  reducers: {
    addTask: {
      reducer(state, { payload }) { state.list.push(payload); },
      prepare(data) { return { payload: { id: nanoid(), status: 'Todo', priority: 'Medium', tags: [], comments: [], ...data } }; }
    },
    updateTask(state, { payload }) {
      const i = state.list.findIndex((t) => t.id === payload.id);
      if (i >= 0) state.list[i] = { ...state.list[i], ...payload };
    },
    deleteTask(state, { payload }) {
      state.list = state.list.filter((t) => t.id !== payload);
    },
    setStatus(state, { payload }) {
      const t = state.list.find((x) => x.id === payload.id);
      if (t) t.status = payload.status;
    },
    addComment(state, { payload }) {
      const t = state.list.find((x) => x.id === payload.taskId);
      if (t) t.comments.push({ id: nanoid(), userId: payload.userId, text: payload.text, at: Date.now() });
    },
  },
});

export const { addTask, updateTask, deleteTask, setStatus, addComment } = taskSlice.actions;
export default taskSlice.reducer;
