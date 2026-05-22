import { Routes, Route, Navigate } from 'react-router-dom';

// Auth
import { useAuth } from '../hooks/useAuth';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Layouts
import DashboardLayout from '../layouts/DashboardLayout';

// Manager Pages
import ManagerDashboard from '../pages/manager/Dashboard';
import Projects from '../pages/manager/Projects';
import Tasks from '../pages/manager/Tasks';
import Team from '../pages/manager/Team';
import Analytics from '../pages/manager/Analytics';
import Calendar from '../pages/manager/Calendar';
import Settings from '../pages/manager/Settings';

// Employee Pages
import EmployeeDashboard from '../pages/employee/Dashboard';
import EmployeeTasks from '../pages/employee/Tasks';
import Kanban from '../pages/employee/Kanban';
import EmployeeCalendar from '../pages/employee/Calendar';
import EmployeeSettings from '../pages/employee/Settings';

function Protected({ role, children }) {
  const user = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (role && user.role !== role) 
    return <Navigate to={user.role === 'manager' ? '/manager/dashboard' : '/employee/dashboard'} replace />;
  return children;
}

export default function AppRoutes() {
  const user = useAuth();
  
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={user.role==='manager'?'/manager/dashboard':'/employee/dashboard'} replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register />} />

      <Route path="/manager" element={<Protected role="manager"><DashboardLayout /></Protected>}>
        <Route path="dashboard" element={<ManagerDashboard />} />
        <Route path="projects" element={<Projects />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="team" element={<Team />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="/employee" element={<Protected role="employee"><DashboardLayout /></Protected>}>
        <Route path="dashboard" element={<EmployeeDashboard />} />
        <Route path="tasks" element={<EmployeeTasks />} />
        <Route path="kanban" element={<Kanban />} />
        <Route path="calendar" element={<EmployeeCalendar />} />
        <Route path="settings" element={<EmployeeSettings />} />
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
