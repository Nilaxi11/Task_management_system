import { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PageHeader from '../../components/common/PageHeader';
import {
  StatusBadge,
  PriorityBadge
} from '../../components/common/StatusBadge';
import Empty from '../../components/common/Empty';
import {
  setStatus,
  addComment
} from '../../redux/slices/taskSlice';
import { useAuth } from '../../hooks/useAuth';
import {
  fmtDate,
  relTime
} from '../../utils/helpers';
import {
  Modal,
  Button
} from 'react-bootstrap';
import { toast } from '../../components/common/Toast';

export default function EmployeeTasks() {

  const me = useAuth();
  const dispatch = useDispatch();

  // ONLY ASSIGNED TASKS
  const tasks = useSelector(
    s => s.tasks.list
  ).filter(
    t => t.assigneeId === me.id
  );

  const users = useSelector(
    s => s.users.list
  );

  const projects = useSelector(
    s => s.projects.list
  );

  const [q, setQ] = useState('');
  const [st, setSt] = useState('All');

  // NEW SORT
  const [sort, setSort] = useState('latest');

  const [detail, setDetail] = useState(null);

  const [text, setText] = useState('');

  // PAGINATION
  const [page, setPage] = useState(1);

  const PER = 8;

  // FILTER + SORT
  const filtered = useMemo(() => {

    let data = tasks.filter(
      t =>
        (st === 'All' ||
          t.status === st) &&
        t.title
          .toLowerCase()
          .includes(q.toLowerCase())
    );

    // latest added first
    if (sort === 'latest') {
      data = [...data].reverse();
    }

    // oldest added first
    if (sort === 'oldest') {
      data = [...data];
    }

    return data;

  }, [tasks, q, st, sort]);

  // PAGINATION
  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PER)
  );

  // PAGE SAFETY
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const pageItems = filtered.slice(
    (page - 1) * PER,
    page * PER
  );

  // STATUS UPDATE
  const updateStatus = (id, s) => {

    dispatch(
      setStatus({
        id,
        status: s
      })
    );

    toast.success(
      'Status updated'
    );
  };

  // COMMENT
  const submitComment = () => {

    if (!text.trim() || !detail)
      return;

    dispatch(
      addComment({
        taskId: detail.id,
        userId: me.id,
        text
      })
    );

    setDetail({
      ...detail,
      comments: [
        ...(detail.comments || []),
        {
          id: Math.random()
            .toString(36),
          userId: me.id,
          text,
          at: Date.now()
        }
      ]
    });

    setText('');
  };

  return (
    <>
      {/* HEADER */}
      <PageHeader
        title="My Tasks"
        subtitle="Everything assigned to you"
        crumbs={[
          { label: 'Employee' },
          { label: 'Tasks' }
        ]}
      />

      {/* FILTERS */}
      <div className="tf-card mb-3">

        <div className="tf-card-body d-flex gap-2 flex-wrap">

          {/* SEARCH */}
          <input
            className="form-control"
            style={{ maxWidth: 300 }}
            placeholder="Search…"
            value={q}
            onChange={e => {
              setQ(e.target.value);
              setPage(1);
            }}
          />

          {/* STATUS */}
          <select
            className="form-select"
            style={{ maxWidth: 180 }}
            value={st}
            onChange={e => {
              setSt(e.target.value);
              setPage(1);
            }}
          >
            <option>All</option>
            <option>Todo</option>
            <option>In Progress</option>
            <option>Review</option>
            <option>Done</option>
          </select>

          {/* SORT */}
          <select
            className="form-select"
            style={{ maxWidth: 180 }}
            value={sort}
            onChange={e => {
              setSort(e.target.value);
              setPage(1);
            }}
          >
            <option value="latest">
              Latest First
            </option>

            <option value="oldest">
              Oldest First
            </option>
          </select>

        </div>

      </div>

      {/* TASK TABLE */}
      <div className="tf-card">

        {filtered.length === 0 ? (

          <Empty
            title="No tasks"
            icon="bi-clipboard-check"
          />

        ) : (

          <div className="table-responsive">

            <table className="tf-table">

              <thead>
                <tr>
                  <th>Task</th>
                  <th>Project</th>
                  <th>Priority</th>
                  <th>Due</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {pageItems.map(t => (

                  <tr
                    key={t.id}
                    style={{
                      cursor: 'pointer'
                    }}
                  >

                    {/* TASK */}
                    <td
                      onClick={() =>
                        setDetail(t)
                      }
                    >

                      <strong>
                        {t.title}
                      </strong>

                      {Array.isArray(
                        t.tags
                      ) &&
                        t.tags.length > 0 && (

                          <div className="d-flex gap-1 mt-1">

                            {t.tags.map(
                              g => (

                                <span
                                  key={g}
                                  className="tf-badge todo"
                                  style={{
                                    fontSize:
                                      '.65rem'
                                  }}
                                >
                                  {g}
                                </span>

                              )
                            )}

                          </div>

                        )}

                    </td>

                    {/* PROJECT */}
                    <td className="small">

                      {
                        projects.find(
                          p =>
                            p.id ===
                            t.projectId
                        )?.name || '—'
                      }

                    </td>

                    {/* PRIORITY */}
                    <td>
                      <PriorityBadge
                        priority={
                          t.priority
                        }
                      />
                    </td>

                    {/* DUE */}
                    <td className="small text-muted">
                      {fmtDate(
                        t.dueDate
                      )}
                    </td>

                    {/* STATUS */}
                    <td>
                      <StatusBadge
                        status={t.status}
                      />
                    </td>

                    {/* ACTION */}
                    <td>

                      <select
                        className="form-select form-select-sm"
                        value={t.status}
                        onClick={e =>
                          e.stopPropagation()
                        }
                        onChange={e =>
                          updateStatus(
                            t.id,
                            e.target.value
                          )
                        }
                      >
                        <option>
                          Todo
                        </option>

                        <option>
                          In Progress
                        </option>

                        <option>
                          Review
                        </option>

                        <option>
                          Done
                        </option>

                      </select>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

        {/* PAGINATION */}
        {totalPages > 1 && (

          <div
            className="d-flex justify-content-between align-items-center p-3 border-top"
            style={{
              borderColor:
                'var(--tf-border)'
            }}
          >

            <div className="small text-muted">
              Page {page} of{' '}
              {totalPages}
            </div>

            <div className="d-flex gap-1">

              <button
                className="btn btn-sm btn-light"
                disabled={page === 1}
                onClick={() =>
                  setPage(
                    p => p - 1
                  )
                }
              >
                <i className="bi bi-chevron-left"></i>
              </button>

              <button
                className="btn btn-sm btn-light"
                disabled={
                  page === totalPages
                }
                onClick={() =>
                  setPage(
                    p => p + 1
                  )
                }
              >
                <i className="bi bi-chevron-right"></i>
              </button>

            </div>

          </div>

        )}

      </div>

      {/* DETAIL MODAL */}
      <Modal
        show={!!detail}
        onHide={() =>
          setDetail(null)
        }
        centered
        size="lg"
      >

        {detail && (
          <>
            <Modal.Header closeButton>

              <Modal.Title>
                {detail.title}
              </Modal.Title>

            </Modal.Header>

            <Modal.Body>

              <div className="d-flex gap-2 mb-3 flex-wrap">

                <StatusBadge
                  status={detail.status}
                />

                <PriorityBadge
                  priority={
                    detail.priority
                  }
                />

                {(detail.tags || []).map(
                  t => (

                    <span
                      key={t}
                      className="tf-badge todo"
                    >
                      {t}
                    </span>

                  )
                )}

              </div>

              <p>
                <strong>
                  Project:
                </strong>{' '}

                {
                  projects.find(
                    p =>
                      p.id ===
                      detail.projectId
                  )?.name
                }
              </p>

              <p>
                <strong>
                  Due:
                </strong>{' '}

                {fmtDate(
                  detail.dueDate
                )}
              </p>

              <hr />

              <h6>
                Comments
              </h6>

              {(!detail.comments ||
                detail.comments
                  .length === 0) && (

                <p className="small text-muted">
                  No comments yet
                </p>

              )}

              {(detail.comments || []).map(
                c => {

                  const u =
                    users.find(
                      x =>
                        x.id ===
                        c.userId
                    );

                  return (
                    <div
                      key={c.id}
                      className="mb-2"
                    >

                      <div className="small">

                        <strong>
                          {u?.name}
                        </strong>

                        <span className="text-muted">
                          {' '}
                          ·{' '}
                          {relTime(
                            c.at
                          )}
                        </span>

                      </div>

                      <div>
                        {c.text}
                      </div>

                    </div>
                  );
                }
              )}

              {/* COMMENT INPUT */}
              <div className="d-flex gap-2 mt-3">

                <input
                  className="form-control"
                  placeholder="Add a comment…"
                  value={text}
                  onChange={e =>
                    setText(
                      e.target.value
                    )
                  }
                />

                <Button
                  variant="primary"
                  onClick={
                    submitComment
                  }
                >
                  Post
                </Button>

              </div>

            </Modal.Body>
          </>
        )}

      </Modal>
    </>
  );
}