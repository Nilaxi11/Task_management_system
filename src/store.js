import { configureStore } from '@reduxjs/toolkit';
import authReducer from './redux/slices/authSlice';
import userReducer from './redux/slices/userSlice';
import projectReducer from './redux/slices/projectSlice';
import taskReducer from './redux/slices/taskSlice';
import notificationReducer from './redux/slices/notificationSlice';
import themeReducer from './redux/slices/themeSlice';

const PERSIST_KEYS = ['auth', 'users', 'projects', 'tasks', 'notifications', 'theme'];

const loadState = () => {
  try {
    const raw = localStorage.getItem('taskflow_state');
    return raw ? JSON.parse(raw) : undefined;
  } catch { return undefined; }
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    projects: projectReducer,
    tasks: taskReducer,
    notifications: notificationReducer,
    theme: themeReducer,
  },
  preloadedState: loadState(),
});

store.subscribe(() => {
  try {
    const s = store.getState();
    const snap = {};
    PERSIST_KEYS.forEach((k) => (snap[k] = s[k]));
    localStorage.setItem('taskflow_state', JSON.stringify(snap));
  } catch {}
});
