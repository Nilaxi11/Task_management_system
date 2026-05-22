export const seedUsers = [
  { id: 'u1', name: 'Alex Morgan', email: 'manager@demo.com', password: 'Password1', role: 'manager', department: 'Operations', avatarColor: '#1677ff' },
  { id: 'u2', name: 'Jordan Lee', email: 'employee@demo.com', password: 'Password1', role: 'employee', department: 'Engineering', avatarColor: '#52c41a' },
  { id: 'u3', name: 'Priya Shah', email: 'priya@demo.com', password: 'Password1', role: 'employee', department: 'Design', avatarColor: '#fa8c16' },
  { id: 'u4', name: 'Diego Ramos', email: 'diego@demo.com', password: 'Password1', role: 'employee', department: 'Engineering', avatarColor: '#eb2f96' },
  { id: 'u5', name: 'Mei Tanaka', email: 'mei@demo.com', password: 'Password1', role: 'employee', department: 'Marketing', avatarColor: '#722ed1' },
];

export const seedProjects = [
  { id: 'p1', name: 'Orion Web Platform', description: 'Customer-facing portal rewrite.', deadline: '2026-07-15', status: 'In Progress', progress: 62, members: ['u2','u3','u4'] },
  { id: 'p2', name: 'Atlas Mobile App', description: 'iOS + Android delivery app.', deadline: '2026-09-01', status: 'In Progress', progress: 35, members: ['u2','u4'] },
  { id: 'p3', name: 'Nova Brand Refresh', description: 'Visual identity & site refresh.', deadline: '2026-06-10', status: 'Review', progress: 80, members: ['u3','u5'] },
  { id: 'p4', name: 'Helios Analytics', description: 'Internal BI dashboard.', deadline: '2026-08-22', status: 'Todo', progress: 10, members: ['u2','u5'] },
];

const today = new Date();
const d = (offset) => new Date(today.getTime() + offset*86400000).toISOString().slice(0,10);

export const seedTasks = [
  { id: 't1', title: 'Design login screen', projectId: 'p1', assigneeId: 'u3', status: 'Done', priority: 'High', dueDate: d(-2), tags:['UI','Auth'], comments:[{id:'c1',userId:'u1',text:'Looks great!',at:Date.now()-86400000}] },
  { id: 't2', title: 'Set up Redux store', projectId: 'p1', assigneeId: 'u2', status: 'Done', priority: 'Medium', dueDate: d(-5), tags:['Frontend'], comments:[] },
  { id: 't3', title: 'Implement Kanban board', projectId: 'p1', assigneeId: 'u2', status: 'In Progress', priority: 'High', dueDate: d(3), tags:['Frontend','DnD'], comments:[] },
  { id: 't4', title: 'API contract for tasks', projectId: 'p2', assigneeId: 'u4', status: 'Review', priority: 'High', dueDate: d(1), tags:['Backend'], comments:[] },
  { id: 't5', title: 'Onboarding flow wireframes', projectId: 'p2', assigneeId: 'u3', status: 'Todo', priority: 'Medium', dueDate: d(7), tags:['UX'], comments:[] },
  { id: 't6', title: 'Brand color tokens', projectId: 'p3', assigneeId: 'u3', status: 'Done', priority: 'Low', dueDate: d(-1), tags:['Design'], comments:[] },
  { id: 't7', title: 'Landing page copy', projectId: 'p3', assigneeId: 'u5', status: 'In Progress', priority: 'Medium', dueDate: d(4), tags:['Copy'], comments:[] },
  { id: 't8', title: 'Data warehouse schema', projectId: 'p4', assigneeId: 'u2', status: 'Todo', priority: 'High', dueDate: d(10), tags:['Data'], comments:[] },
  { id: 't9', title: 'Marketing funnel report', projectId: 'p4', assigneeId: 'u5', status: 'Todo', priority: 'Low', dueDate: d(14), tags:['Analytics'], comments:[] },
  { id: 't10', title: 'Push notification spec', projectId: 'p2', assigneeId: 'u2', status: 'In Progress', priority: 'Medium', dueDate: d(2), tags:['Mobile'], comments:[] },
];

export const seedNotifications = [
  { id: 'n1', title: 'Task assigned', body: 'You were assigned "Implement Kanban board"', at: Date.now()-3600_000, read: false, userId:'u2' },
  { id: 'n2', title: 'Deadline soon', body: '"API contract for tasks" is due tomorrow', at: Date.now()-7200_000, read: false, userId:'u4' },
  { id: 'n3', title: 'Project updated', body: 'Nova Brand Refresh moved to Review', at: Date.now()-86400_000, read: true, userId:'u1' },
];
