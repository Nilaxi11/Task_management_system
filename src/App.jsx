import { useEffect } from 'react';
import { useSelector } from 'react-redux';
// toast
import { ToastContainer } from './components/common/Toast';
// routes
import AppRoutes from './routes/AppRoutes';

export default function App() {
  const theme = useSelector((s) => s.theme.mode);
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  return (
    <>
      <AppRoutes />
      <ToastContainer />
    </>
  );
}
