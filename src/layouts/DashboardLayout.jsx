import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown } from 'react-bootstrap';
import { useState } from 'react';
import { toggleSidebar, toggleTheme } from '../redux/slices/themeSlice';
import { logout } from '../redux/slices/authSlice';
import { markAllRead, markRead } from '../redux/slices/notificationSlice';
import { useAuth } from '../hooks/useAuth';
import Avatar from '../components/common/Avatar';
import { relTime } from '../utils/helpers';

// manager : Dashboard, Projects, Tasks, Team, Analytics, Calendar, Settings
const managerNav = [
  {
    section: 'Workspace', items: [
      { to: '/manager/dashboard', icon: 'bi-grid-1x2', label: 'Dashboard' },
      { to: '/manager/projects', icon: 'bi-folder', label: 'Projects' },
      { to: '/manager/tasks', icon: 'bi-check2-square', label: 'Tasks' },
      { to: '/manager/team', icon: 'bi-people', label: 'Team' },
    ]
  },
  {
    section: 'Insights', items: [
      { to: '/manager/analytics', icon: 'bi-bar-chart-line', label: 'Analytics' },
      { to: '/manager/calendar', icon: 'bi-calendar3', label: 'Calendar' },
    ]
  },
  {
    section: 'Account', items: [
      { to: '/manager/settings', icon: 'bi-gear', label: 'Settings' },
    ]
  },
];

// employee : Dashboard, Tasks, Kanban, Calendar, Settings
const employeeNav = [
  {
    section: 'Workspace', items: [
      { to: '/employee/dashboard', icon: 'bi-grid-1x2', label: 'Dashboard' },
      { to: '/employee/tasks', icon: 'bi-check2-square', label: 'My Tasks' },
      { to: '/employee/kanban', icon: 'bi-kanban', label: 'Kanban' },
    ]
  },
  {
    section: 'Insights', items: [
      { to: '/employee/calendar', icon: 'bi-calendar3', label: 'Calendar' },
    ]
  },
  {
    section: 'Account', items: [
      { to: '/employee/settings', icon: 'bi-gear', label: 'Settings' },
    ]
  },
];

export default function DashboardLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useAuth();

  const collapsed = useSelector((s) => s.theme.sidebarCollapsed);
  const themeMode = useSelector((s) => s.theme.mode);
  const notifs = useSelector((s) => s.notifications.list);
  const myNotifs = notifs.filter((n) => !n.userId || n.userId === user.id);
  const unread = myNotifs.filter((n) => !n.read).length;

  const [mobileOpen, setMobileOpen] = useState(false);
  const nav = user.role === 'manager' ? managerNav : employeeNav;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    // sidebar + header + content layout
    <div className="tf-shell">
      {/* Sidebar start*/}
      <aside className={`tf-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>

        {/* logo start */}
        <div className="brand">
          <div className="logo">TF</div>
          <span className="brand-text">TaskFlow</span>
        </div>
        {/* logo end */}

        {/* Navigation */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {nav.map((sec, i) => (
            <div key={i}>
              <div className="tf-navsection"><span>{sec.section}</span></div>
              {sec.items.map((it) => (
                <NavLink key={it.to} to={it.to} className={({ isActive }) => `tf-navlink ${isActive ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>
                  <i className={`bi ${it.icon}`}></i><span>{it.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </div>

        {/* User Profile start */}
        <div className="p-3 border-top" style={{ borderColor: 'var(--tf-border)' }}>
          <div className="d-flex align-items-center gap-2">
            <Avatar user={user} size="sm" />
            {!collapsed && (
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '.8rem', fontWeight: 600 }} className="text-truncate">{user.name}</div>
                <div style={{ fontSize: '.7rem', color: 'var(--tf-muted)' }}>{user.role}</div>
              </div>
            )}
          </div>
        </div>
        {/* User Profile end */}
      </aside>
      {/* Sidebar end */}

      <div className={`tf-main ${collapsed ? 'collapsed' : ''}`}>
        {/* Header start */}
        <header className="tf-header">
          <button className="btn btn-light d-lg-none" onClick={() => setMobileOpen((v) => !v)}>
            <i className="bi bi-list"></i>
          </button>
          <button className="btn btn-light d-none d-lg-inline-flex" onClick={() => dispatch(toggleSidebar())}>
            <i className="bi bi-list"></i>
          </button>
          {/* <div className="search">
            <i className="bi bi-search"></i>
            <input placeholder="Search projects, tasks, people..." />
          </div> */}
          <div className="ms-auto d-flex align-items-center gap-2">

            {/* Theme Toggle */}
            <button className="btn btn-light" onClick={() => dispatch(toggleTheme())} title="Toggle theme">
              <i className={`bi ${themeMode === 'dark' ? 'bi-sun' : 'bi-moon'}`}></i>
            </button>
            {/* theme toggle end */}

            {/* notifications start */}
            <Dropdown align="end">
              <Dropdown.Toggle as="button" className="btn btn-light position-relative" bsPrefix="btn">
                <i className="bi bi-bell"></i>
                {unread > 0 && <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '.6rem' }}>{unread}</span>}
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ width: 320, padding: 0 }}>
                <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                  <strong>Notifications</strong>
                  <button className="btn btn-link p-0" style={{ fontSize: '.75rem' }} onClick={() => dispatch(markAllRead())}>Mark all read</button>
                </div>
                <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                  {myNotifs.length === 0 && <div className="p-3 text-muted small">No notifications</div>}
                  {myNotifs.map((n) => (
                    <div key={n.id} className="p-3 border-bottom" style={{ background: n.read ? 'transparent' : 'var(--tf-primary-soft)', cursor: 'pointer' }} onClick={() => dispatch(markRead(n.id))}>
                      <div style={{ fontSize: '.85rem', fontWeight: 600 }}>{n.title}</div>
                      <div style={{ fontSize: '.78rem', color: 'var(--tf-muted)' }}>{n.body}</div>
                      <div style={{ fontSize: '.7rem', color: 'var(--tf-muted)' }}>{relTime(n.at)}</div>
                    </div>
                  ))}
                </div>
              </Dropdown.Menu>
            </Dropdown>
            {/* notifications end */}

            <Dropdown align="end">

              <Dropdown.Toggle as="button" className="btn btn-light d-flex align-items-center gap-2" bsPrefix="btn">
                <Avatar user={user} size="sm" />
                <span className="d-none d-md-inline" style={{ fontSize: '.85rem' }}>{user.name}</span>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Header>{user.email}</Dropdown.Header>
                <Dropdown.Item onClick={() => navigate(user.role === 'manager' ? '/manager/settings' : '/employee/settings')}><i className="bi bi-person me-2"></i>Profile</Dropdown.Item>
                <Dropdown.Item onClick={() => navigate(user.role === 'manager' ? '/manager/settings' : '/employee/settings')}><i className="bi bi-gear me-2"></i>Settings</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout}><i className="bi bi-box-arrow-right me-2"></i>Logout</Dropdown.Item>
              </Dropdown.Menu>
              
            </Dropdown>
          </div>
        </header>
        {/* Header end */}

        {/* main content start */}
        <main className="tf-content">
          <Outlet />
        </main>
        {/* main content end */}
      </div>

    </div>
  );
}
