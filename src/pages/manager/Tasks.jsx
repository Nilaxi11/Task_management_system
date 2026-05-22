import { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { Formik } from 'formik';
import PageHeader from '../../components/common/PageHeader';
import Avatar from '../../components/common/Avatar';
import { StatusBadge, PriorityBadge } from '../../components/common/StatusBadge';
import Empty from '../../components/common/Empty';
import { addTask, updateTask, deleteTask, addComment } from '../../redux/slices/taskSlice';
import { addNotification } from '../../redux/slices/notificationSlice';
import { taskSchema } from '../../validations/schemas';
import { toast } from '../../components/common/Toast';
import { fmtDate, relTime } from '../../utils/helpers';
import { useAuth } from '../../hooks/useAuth';

export default function Tasks() {
  const tasks = useSelector(s => s.tasks.list);
  const users = useSelector(s => s.users.list);
  const projects = useSelector(s => s.projects.list);

  const dispatch = useDispatch();
  const me = useAuth();

  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(null);
  const [detail, setDetail] = useState(null);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(1);
  const PER = 8;

  const filtered = useMemo(() => tasks.filter(t =>
    (status === 'All' || t.status === status) &&
    t.title.toLowerCase().includes(q.toLowerCase())
  ), [tasks, q, status]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER));
  const pageItems = filtered.slice((page - 1) * PER, page * PER);

  const open = (t = null) => { setEditing(t); setShow(true); };
  const close = () => { setShow(false); setEditing(null); };

  const handleSubmit = (vals) => {
    if (editing) { dispatch(updateTask(vals)); toast.success('Task updated'); }
    else {
      const tagsArr = typeof vals.tags === 'string' ? vals.tags.split(',').map(s => s.trim()).filter(Boolean) : vals.tags;
      dispatch(addTask({ ...vals, tags: tagsArr }));
      dispatch(addNotification({ title: 'Task assigned', body: `You were assigned "${vals.title}"`, userId: vals.assigneeId }));
      toast.success('Task created');
    }
    close();
  };

  return (
    <>
      {/* page header start */}
      <PageHeader title="Tasks" subtitle="Manage all tasks across projects" crumbs={[{ label: 'Manager' }, { label: 'Tasks' }]}
        actions={<Button onClick={() => open()}><i className="bi bi-plus-lg me-1"></i>New Task</Button>}
      />
      {/* page header end */}

      <div className="tf-card mb-3">
        {/* Search and Filter start */}
        <div className="tf-card-body d-flex gap-2 flex-wrap">
          <input className="form-control" placeholder="Search tasks" style={{ maxWidth: 300 }} value={q} onChange={e => { setQ(e.target.value); setPage(1); }} />
          <select className="form-select" style={{ maxWidth: 180 }} value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
            <option>All</option>
            <option>Todo</option>
            <option>In Progress</option>
            <option>Review</option>
            <option>Done</option>
          </select>
        </div>
        {/*  search and filter end */}
      </div>

      <div className="tf-card">
        {filtered.length === 0 ? <Empty title="No tasks" icon="bi-clipboard-x" /> : (
          <div className="table-responsive">
            {/* Task Table start */}
            <table className="tf-table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Project</th>
                  <th>Assignee</th>
                  <th>Priority</th>
                  <th>Due</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {pageItems.map(t => {
                  const u = users.find(x => x.id === t.assigneeId);
                  const p = projects.find(x => x.id === t.projectId);
                  return <tr key={t.id} style={{ cursor: 'pointer' }}>
                    <td onClick={() => setDetail(t)}><strong>{t.title}</strong>{t.tags.length > 0 && <div className="d-flex gap-1 mt-1">{t.tags.map(tg => <span key={tg} className="tf-badge todo" style={{ fontSize: '.65rem' }}>{tg}</span>)}</div>}</td>
                    <td className="small">{p?.name || '—'}</td>
                    <td><div className="d-flex align-items-center gap-2"><Avatar user={u} size="sm" /><span className="small">{u?.name}</span></div></td>
                    <td><PriorityBadge priority={t.priority} /></td>
                    <td className="small text-muted">{fmtDate(t.dueDate)}</td>
                    <td><StatusBadge status={t.status} /></td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-light me-1" onClick={() => open(t)}><i className="bi bi-pencil"></i></button>
                      <button className="btn btn-sm btn-light text-danger" onClick={() => { dispatch(deleteTask(t.id)); toast.success('Task deleted'); }}><i className="bi bi-trash"></i></button>
                    </td>
                  </tr>;
                })}
              </tbody>
            </table>
            {/* Task Table end */}
          </div>
        )}
        {/* Pagination start */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-between align-items-center p-3 border-top" style={{ borderColor: 'var(--tf-border)' }}>
            <div className="small text-muted">Page {page} of {totalPages}</div>
            <div className="d-flex gap-1">
              <button className="btn btn-sm btn-light" disabled={page === 1} onClick={() => setPage(p => p - 1)}><i className="bi bi-chevron-left"></i></button>
              <button className="btn btn-sm btn-light" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}><i className="bi bi-chevron-right"></i></button>
            </div>
          </div>
        )}
        {/* Pagination end */}
      </div>

      {/* Create/Edit modal */}
      <Modal show={show} onHide={close} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editing ? 'Edit task' : 'New task'}</Modal.Title>
        </Modal.Header>

        <Formik
          initialValues={editing ? { ...editing, tags: editing.tags.join(', ') } : { title: '', projectId: projects[0]?.id || '', assigneeId: users.find(u => u.role === 'employee')?.id || '', status: 'Todo', priority: 'Medium', dueDate: '', tags: '' }}
          validationSchema={taskSchema}
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <Modal.Body>
                <div className="mb-3"><label className="form-label">Title</label>
                  <input name="title" className={`form-control ${touched.title && errors.title ? 'is-invalid' : ''}`} value={values.title} onChange={handleChange} />
                  {touched.title && errors.title && <div className="invalid-feedback">{errors.title}</div>}
                </div>
                <div className="row g-2">
                  <div className="col-md-6"><label className="form-label">Project</label>
                    <select name="projectId" className="form-select" value={values.projectId} onChange={handleChange}>
                      {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6"><label className="form-label">Assignee</label>
                    <select name="assigneeId" className="form-select" value={values.assigneeId} onChange={handleChange}>
                      {users.filter(u => u.role === 'employee').map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                    </select>
                  </div>
                  <div className="col-md-4"><label className="form-label">Status</label>
                    <select name="status" className="form-select" value={values.status} onChange={handleChange}>
                      <option>Todo</option><option>In Progress</option><option>Review</option><option>Done</option>
                    </select>
                  </div>
                  <div className="col-md-4"><label className="form-label">Priority</label>
                    <select name="priority" className="form-select" value={values.priority} onChange={handleChange}>
                      <option>Low</option><option>Medium</option><option>High</option>
                    </select>
                  </div>
                  <div className="col-md-4"><label className="form-label">Due date</label>
                    <input type="date" name="dueDate" className={`form-control ${touched.dueDate && errors.dueDate ? 'is-invalid' : ''}`} value={values.dueDate} onChange={handleChange} />
                  </div>
                </div>
                <div className="mt-3"><label className="form-label">Tags (comma-separated)</label>
                  <input name="tags" className="form-control" value={values.tags} onChange={handleChange} />
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="light" onClick={close}>Cancel</Button>
                <Button type="submit" variant="primary">{editing ? 'Save' : 'Create'}</Button>
              </Modal.Footer>
            </form>
          )}
        </Formik>

      </Modal>
      {/* create modal end */}

      {/* Detail modal start*/}
      <Modal show={!!detail} onHide={() => setDetail(null)} centered size="lg">
        {detail && (
          <>
            <Modal.Header closeButton><Modal.Title>{detail.title}</Modal.Title></Modal.Header>
            <Modal.Body>
              <div className="d-flex gap-2 mb-3 flex-wrap"><StatusBadge status={detail.status} /><PriorityBadge priority={detail.priority} />{detail.tags.map(t => <span key={t} className="tf-badge todo">{t}</span>)}</div>
              <p><strong>Project:</strong> {projects.find(p => p.id === detail.projectId)?.name}</p>
              <p><strong>Assignee:</strong> {users.find(u => u.id === detail.assigneeId)?.name}</p>
              <p><strong>Due:</strong> {fmtDate(detail.dueDate)}</p>
              <hr />
              <h6>Comments</h6>
              {detail.comments.length === 0 && <p className="small text-muted">No comments yet</p>}
              {detail.comments.map(c => {
                const u = users.find(x => x.id === c.userId);
                return <div key={c.id} className="d-flex gap-2 mb-2"><Avatar user={u} size="sm" />
                  <div><div className="small"><strong>{u?.name}</strong> <span className="text-muted">· {relTime(c.at)}</span></div><div>{c.text}</div></div>
                </div>;
              })}
              <Formik initialValues={{ text: '' }} onSubmit={(v, { resetForm }) => { if (!v.text.trim()) return; dispatch(addComment({ taskId: detail.id, userId: me.id, text: v.text })); const updated = { ...detail, comments: [...detail.comments, { id: Math.random().toString(36), userId: me.id, text: v.text, at: Date.now() }] }; setDetail(updated); resetForm(); }}>
                {({ values, handleChange, handleSubmit }) => (
                  <form onSubmit={handleSubmit} className="d-flex gap-2 mt-3">
                    <input name="text" className="form-control" placeholder="Add a comment…" value={values.text} onChange={handleChange} />
                    <Button type="submit" variant="primary">Post</Button>
                  </form>
                )}
              </Formik>
            </Modal.Body>
          </>
        )}
      </Modal>
      {/* detail modal end */}
    </>
  );
}
