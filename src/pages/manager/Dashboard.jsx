import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import PageHeader from '../../components/common/PageHeader';
import Avatar from '../../components/common/Avatar';
import { StatusBadge } from '../../components/common/StatusBadge';
import { fmtDate, relTime } from '../../utils/helpers';

const icons = [
  { icon: 'bi-folder-fill', bg: '#e6f0ff', color: '#1677ff', label: 'Projects', key: 'projects' },
  { icon: 'bi-check2-square', bg: '#dcfce7', color: '#16a34a', label: 'Tasks', key: 'tasks' },
  { icon: 'bi-people-fill', bg: '#fef3c7', color: '#d97706', label: 'Team', key: 'team' },
  { icon: 'bi-graph-up-arrow', bg: '#fce7f3', color: '#db2777', label: 'Completion', key: 'completion' },
];

const PIE_COLORS = ['#94a3b8', '#1677ff', '#f59e0b', '#22c55e'];

export default function ManagerDashboard() {
  const projects = useSelector((s) => s.projects.list);
  const tasks = useSelector((s) => s.tasks.list);
  const users = useSelector((s) => s.users.list);

  const stats = {
    projects: projects.length,
    tasks: tasks.length,
    team: users.filter(u => u.role === 'employee').length,
    completion: Math.round((tasks.filter(t => t.status === 'Done').length / Math.max(tasks.length, 1)) * 100) + '%',
  };

  const statusCounts = ['Todo', 'In Progress', 'Review', 'Done'].map((s) => ({ name: s, value: tasks.filter(t => t.status === s).length }));

  // line chart data (random data for demo)
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString(undefined, { weekday: 'short' });
    return { day: label, created: Math.floor(Math.random() * 8) + 2, completed: Math.floor(Math.random() * 6) + 1, key };
  });

  const recentTasks = [...tasks].sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate)).slice(0, 3);
  const upcoming = [...tasks].filter(t => t.status !== 'Done').sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)).slice(0, 5);

  return (
    <>
      {/* Page Header start*/}
      <PageHeader title="Dashboard" subtitle="Overview of your projects, tasks, and team performance" crumbs={[{ label: 'Manager' }, { label: 'Dashboard' }]} />
      {/* page header end */}
      {/* Stats start*/}
      <div className="row g-3 mb-4">
        {icons.map((s) => {

          const links = {
            projects: '/manager/projects',
            tasks: '/manager/tasks',
            team: '/manager/team',
            completion: '/manager/tasks'
          };

          return (
            <div
              className="col-12 col-sm-6 col-xl-3"
              key={s.key}
            >

              <Link
                to={links[s.key]}
                style={{
                  textDecoration: 'none',
                  color: 'inherit'
                }}
              >

                <div
                  className="tf-stat"
                  style={{
                    cursor: 'pointer',
                    transition: '.2s'
                  }}
                >

                  <div
                    className="icon"
                    style={{
                      background: s.bg,
                      color: s.color
                    }}
                  >
                    <i className={`bi ${s.icon}`}></i>
                  </div>

                  <div>

                    <div className="label">
                      {s.label}
                    </div>

                    <div className="value">
                      {stats[s.key]}
                    </div>

                    <div className="trend text-success">
                      <i className="bi bi-arrow-up"></i>
                      {' '}12% vs last week
                    </div>

                  </div>

                </div>

              </Link>

            </div>
          );
        })}
      </div>
      {/* Stats End */}

      {/* Activity Chart Start*/}
      <div className="row g-3 mb-4">
        <div className="col-12 col-xl-8">
          <div className="tf-card h-100">
            <div className="tf-card-header"><h6>Activity (last 7 days)</h6><span className="small text-muted">Created vs Completed</span></div>
            <div className="tf-card-body" style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={days}>
                  <CartesianGrid stroke="var(--tf-border)" strokeDasharray="3 3" />
                  <XAxis dataKey="day" stroke="var(--tf-muted)" fontSize={12} />
                  <YAxis stroke="var(--tf-muted)" fontSize={12} />
                  <Tooltip contentStyle={{ background: 'var(--tf-surface)', border: '1px solid var(--tf-border)' }} />
                  <Legend />
                  <Line type="monotone" dataKey="created" stroke="#1677ff" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="completed" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="col-12 col-xl-4">
          <div className="tf-card h-100">
            <div className="tf-card-header"><h6>Task Distribution</h6></div>
            <div className="tf-card-body" style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusCounts} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
                    {statusCounts.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
      {/* Activity Chart End */}


      <div className="row g-3">
        {/* Recent Tasks Start*/}
        <div className="col-12 col-xl-7">
          <div className="tf-card h-100">
            <div className="tf-card-header"><h6>Recent Tasks</h6><Link to="/manager/tasks" className="small">View all</Link></div>
            <table className="tf-table">
              <thead><tr><th>Task</th><th>Assignee</th><th>Due</th><th>Status</th></tr></thead>
              <tbody>
                {recentTasks.map((t) => {
                  const u = users.find(x => x.id === t.assigneeId);
                  return <tr key={t.id}>
                    <td><strong>{t.title}</strong></td>
                    <td><div className="d-flex align-items-center gap-2"><Avatar user={u} size="sm" /><span className="small">{u?.name}</span></div></td>
                    <td className="small text-muted">{fmtDate(t.dueDate)}</td>
                    <td><StatusBadge status={t.status} /></td>
                  </tr>;
                })}
              </tbody>
            </table>
          </div>
        </div>
        {/* Recent Tasks end */}

        {/* Upcoming Deadlines start */}
        <div className="col-12 col-xl-5">
          <div className="tf-card h-100">
            <div className="tf-card-header"><h6>Upcoming Deadlines</h6></div>
            <div className="tf-card-body" style={{ maxHeight: 360, overflowY: 'auto' }}>
              {upcoming.map((t) => {
                const u = users.find(x => x.id === t.assigneeId);
                return (
                  <div key={t.id} className="d-flex align-items-center gap-3 py-2 border-bottom" style={{ borderColor: 'var(--tf-border)' }}>
                    <Avatar user={u} size="sm" />
                    <div className="flex-grow-1 min-width-0">
                      <div style={{ fontSize: '.88rem', fontWeight: 600 }} className="text-truncate">{t.title}</div>
                      <div className="small text-muted">Due {fmtDate(t.dueDate)} · {relTime(new Date(t.dueDate).getTime())}</div>
                    </div>
                    <StatusBadge status={t.status} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {/* Upcoming Deadlines end */}
      </div>
    </>
  );
}
