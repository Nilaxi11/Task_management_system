import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import PageHeader from '../../components/common/PageHeader';
import { StatusBadge, PriorityBadge } from '../../components/common/StatusBadge';
import Empty from '../../components/common/Empty';
import { useAuth } from '../../hooks/useAuth';
import { fmtDate, relTime } from '../../utils/helpers';

export default function EmployeeDashboard() {
  const me = useAuth();
  const tasks = useSelector(s => s.tasks.list).filter(t => t.assigneeId === me.id);
  const projects = useSelector(s => s.projects.list);
  const notifs = useSelector(s => s.notifications.list).filter(n => !n.userId || n.userId === me.id);

  const stats = [
    {
      label: 'Assigned',
      value: tasks.length,
      icon: 'bi-check2-square',
      bg: '#e6f0ff',
      color: '#1677ff'
    },
    {
      label: 'In Progress',
      value: tasks.filter(t => t.status === 'In Progress').length,
      icon: 'bi-hourglass-split',
      bg: '#dbeafe',
      color: '#1d4ed8'
    },
    {
      label: 'Done',
      value: tasks.filter(t => t.status === 'Done').length,
      icon: 'bi-check-circle',
      bg: '#dcfce7',
      color: '#16a34a'
    },
    {
      label: 'Overdue',
      value: tasks.filter(t => t.status !== 'Done' && new Date(t.dueDate) < new Date()).length,
      icon: 'bi-exclamation-triangle',
      bg: '#fee2e2',
      color: '#dc2626'
    },
  ];

  const upcoming = [...tasks].filter(t => t.status !== 'Done').sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)).slice(0, 5);

  const data = ['Todo', 'In Progress', 'Review', 'Done'].map(s => ({ status: s, count: tasks.filter(t => t.status === s).length }));

  return (
    <>
      {/* Page Header start*/}
      <PageHeader title={`Hello, ${me.name.split(' ')[0]}`} subtitle="Here's a snapshot of your work today" crumbs={[{ label: 'Employee' }, { label: 'Dashboard' }]} />
      {/* Page Header end */}

      {/* Stats start*/}
      <div className="row g-3 mb-4">
        {stats.map(s => (
          <div className="col-12 col-sm-6 col-xl-3" key={s.label}>
            <div className="tf-stat">
              <div className="icon" style={{ background: s.bg, color: s.color }}><i className={`bi ${s.icon}`}></i></div>
              <div><div className="label">{s.label}</div><div className="value">{s.value}</div></div>
            </div>
          </div>
        ))}
      </div>
      {/* Stats end */}


      <div className="row g-3">
        {/* Activity Chart Start*/}
        <div className="col-12 col-xl-7">
          <div className="tf-card">
            <div className="tf-card-header"><h6>Your task breakdown</h6></div>
            <div className="tf-card-body" style={{ height: 300 }}>
              <ResponsiveContainer><BarChart data={data}>
                <CartesianGrid stroke="var(--tf-border)" strokeDasharray="3 3" />
                <XAxis dataKey="status" stroke="var(--tf-muted)" fontSize={12} /><YAxis stroke="var(--tf-muted)" fontSize={12} />
                <Tooltip contentStyle={{ background: 'var(--tf-surface)', border: '1px solid var(--tf-border)' }} />
                <Bar dataKey="count" fill="#1677ff" radius={[6, 6, 0, 0]} />
              </BarChart></ResponsiveContainer>
            </div>
          </div>
        </div>
        {/* Activity Chart End */}

        {/* Upcoming deadlines Start*/}
        <div className="col-12 col-xl-5">
          <div className="tf-card">
            <div className="tf-card-header"><h6>Upcoming deadlines</h6><Link to="/employee/tasks" className="small">All</Link></div>
            <div className="tf-card-body">
              {upcoming.length === 0 ? <Empty icon="bi-stars" title="All clear!" body="No upcoming tasks." /> : upcoming.map(t => (
                <div key={t.id} className="d-flex justify-content-between align-items-center py-2 border-bottom" style={{ borderColor: 'var(--tf-border)' }}>
                  <div>
                    <div style={{ fontSize: '.88rem', fontWeight: 600 }}>{t.title}</div>
                    <div className="small text-muted">{projects.find(p => p.id === t.projectId)?.name} · Due {fmtDate(t.dueDate)}</div>
                  </div>
                  <PriorityBadge priority={t.priority} />
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Upcoming deadlines End */}

        {/* Activity Feed start*/}
        <div className="col-12">
          <div className="tf-card">
            <div className="tf-card-header"><h6>Activity feed</h6></div>
            <div className="tf-card-body">
              {notifs.length === 0 ? <Empty title="No activity" icon="bi-activity" /> : notifs.slice(0, 8).map(n => (
                <div key={n.id} className="d-flex gap-2 py-2 border-bottom" style={{ borderColor: 'var(--tf-border)' }}>
                  <i className="bi bi-bell-fill text-primary mt-1"></i>
                  <div><div style={{ fontSize: '.88rem', fontWeight: 600 }}>{n.title}</div><div className="small text-muted">{n.body} · {relTime(n.at)}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Activity Feed end */}
      </div>
    </>
  );
}
