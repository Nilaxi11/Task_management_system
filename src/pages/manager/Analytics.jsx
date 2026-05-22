import { useSelector } from 'react-redux';
import { BarChart, Bar, AreaChart, Area, RadialBarChart, RadialBar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import PageHeader from '../../components/common/PageHeader';

export default function Analytics() {
  const tasks = useSelector(s => s.tasks.list);
  const users = useSelector(s => s.users.list);
  const projects = useSelector(s => s.projects.list);

  const perAssignee = users.filter(u => u.role === 'employee').map(u => ({
    name: u.name.split(' ')[0],
    done: tasks.filter(t => t.assigneeId === u.id && t.status === 'Done').length,
    open: tasks.filter(t => t.assigneeId === u.id && t.status !== 'Done').length,
  }));

  const perProject = projects.map(p => ({ name: p.name.slice(0, 14), progress: p.progress }));

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(m => ({ month: m, completed: Math.floor(Math.random() * 40) + 10, created: Math.floor(Math.random() * 50) + 15 }));

  return (
    <>
      {/* page header start */}
      <PageHeader title="Analytics" subtitle="Productivity, completion, and team performance" crumbs={[{ label: 'Manager' }, { label: 'Analytics' }]} />
      {/* page header end */}

      {/* chart container start */}
      <div className="row g-3">
        {/* productivity chart */}
        <div className="col-12 col-xl-8">
          <div className="tf-card">
            <div className="tf-card-header"><h6>Productivity over time</h6></div>
            <div className="tf-card-body" style={{ height: 320 }}>
              <ResponsiveContainer><AreaChart data={months}>
                <defs>
                  <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#1677ff" stopOpacity={.4} /><stop offset="100%" stopColor="#1677ff" stopOpacity={0} /></linearGradient>
                  <linearGradient id="g2" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#22c55e" stopOpacity={.4} /><stop offset="100%" stopColor="#22c55e" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid stroke="var(--tf-border)" strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke="var(--tf-muted)" fontSize={12} /><YAxis stroke="var(--tf-muted)" fontSize={12} />
                <Tooltip contentStyle={{ background: 'var(--tf-surface)', border: '1px solid var(--tf-border)' }} /><Legend />
                <Area dataKey="created" stroke="#1677ff" fill="url(#g1)" />
                <Area dataKey="completed" stroke="#22c55e" fill="url(#g2)" />
              </AreaChart></ResponsiveContainer>
            </div>
          </div>
        </div>
        {/* productivity chart end */}

        {/* project progress chart */}
        <div className="col-12 col-xl-4">
          <div className="tf-card h-100">
            <div className="tf-card-header"><h6>Project progress</h6></div>
            <div className="tf-card-body" style={{ height: 320 }}>
              <ResponsiveContainer><RadialBarChart innerRadius="20%" outerRadius="100%" data={perProject} startAngle={90} endAngle={-270}>
                <RadialBar dataKey="progress" cornerRadius={6} fill="#1677ff" />
                <Tooltip />
              </RadialBarChart></ResponsiveContainer>
            </div>
          </div>
        </div>
        {/* project progress chart end */}

        {/* team performance chart */}
        <div className="col-12">
          <div className="tf-card">
            <div className="tf-card-header"><h6>Team performance</h6></div>
            <div className="tf-card-body" style={{ height: 340 }}>
              <ResponsiveContainer><BarChart data={perAssignee}>
                <CartesianGrid stroke="var(--tf-border)" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="var(--tf-muted)" fontSize={12} /><YAxis stroke="var(--tf-muted)" fontSize={12} />
                <Tooltip contentStyle={{ background: 'var(--tf-surface)', border: '1px solid var(--tf-border)' }} /><Legend />
                <Bar dataKey="done" fill="#22c55e" radius={[6, 6, 0, 0]} />
                <Bar dataKey="open" fill="#1677ff" radius={[6, 6, 0, 0]} />
              </BarChart></ResponsiveContainer>
            </div>
          </div>
        </div>
        {/* team performance chart end */}
      </div>
      {/* chart container end */}
    </>
  );
}
