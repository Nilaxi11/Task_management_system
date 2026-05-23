import { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PageHeader from '../../components/common/PageHeader';
import Avatar from '../../components/common/Avatar';
import Empty from '../../components/common/Empty';
import { deleteUser, addUser } from '../../redux/slices/userSlice';
import { toast } from '../../components/common/Toast';
import { Modal, Button } from 'react-bootstrap';
import { Formik } from 'formik';
import { profileSchema } from '../../validations/schemas';
export default function Team() {
  const users = useSelector(s => s.users.list);
  const tasks = useSelector(s => s.tasks.list);
  const dispatch = useDispatch();
  const [q, setQ] = useState('');
  const [dept, setDept] = useState('All');

  const [show, setShow] = useState(false);

  // const [form, setForm] = useState({
  //   name: '',
  //   email: '',
  //   department: '',
  //   password: ''
  // });

  const employees = useMemo(() => users.filter(u =>
    u.role === 'employee' &&
    (dept === 'All' || u.department === dept) &&
    (u.name.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase()))
  ), [users, q, dept]);

  const depts = ['All', ...new Set(users.filter(u => u.role === 'employee').map(u => u.department))];
  const submitMember = async () => {
    try {
      await profileSchema.validate(form, { abortEarly: false });

      dispatch(addUser({
        name: form.name,
        email: form.email,
        department: form.department,
        password: form.password,
        role: 'employee'
      }));

      toast.success('Member added');
      setShow(false);

      setForm({
        name: '',
        email: '',
        department: '',
        password: ''
      });

    } catch (err) {
      toast.error(err.errors?.[0] || 'Validation error');
    }
  };
  return (
    <>
      {/* page header start */}
      <PageHeader
        title="Team"
        subtitle="Manage your team members and departments"
        crumbs={[
          { label: 'Manager' },
          { label: 'Team' }
        ]}
        actions={
          <Button onClick={() => setShow(true)}>
            <i className="bi bi-plus-lg me-1"></i>
            Add Member
          </Button>
        }
      />
      {/* page header end */}

      <div className="tf-card mb-3">

        <div className="tf-card-body d-flex gap-2 flex-wrap">
          <input className="form-control" style={{ maxWidth: 300 }} placeholder="Search team" value={q} onChange={e => setQ(e.target.value)} />
          <select className="form-select" style={{ maxWidth: 200 }} value={dept} onChange={e => setDept(e.target.value)}>
            {depts.map(d => <option key={d}>{d}</option>)}
          </select>

        </div>

      </div>

      {employees.length === 0 ? <Empty title="No team members" icon="bi-people" /> : (
        <div className="row g-3">
          {employees.map(u => {
            const open = tasks.filter(t => t.assigneeId === u.id && t.status !== 'Done').length;
            const done = tasks.filter(t => t.assigneeId === u.id && t.status === 'Done').length;
            return (
              <div key={u.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                <div className="tf-card h-100 text-center">
                  <div className="tf-card-body">
                    <Avatar user={u} size="lg" className="mb-3" />
                    <h6 className="mb-1">{u.name}</h6>
                    <div className="small text-muted mb-2">{u.email}</div>
                    <span className="tf-badge progress mb-3 d-inline-block">{u.department}</span>
                    <div className="row text-center mt-2">
                      <div className="col-6 border-end"><div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{open}</div><div className="small text-muted">Open</div></div>
                      <div className="col-6"><div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{done}</div><div className="small text-muted">Done</div></div>
                    </div>
                    <button className="btn btn-sm btn-outline-danger mt-3" onClick={() => { dispatch(deleteUser(u.id)); toast.success('Member removed'); }}><i className="bi bi-trash me-1"></i>Remove</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal show={show} onHide={() => setShow(false)} centered>

        <Formik
          initialValues={{
            name: '',
            email: '',
            department: '',
            password: ''
          }}
          validationSchema={profileSchema}
          onSubmit={(values) => {
            dispatch(addUser({
              ...values,
              role: 'employee'
            }));

            toast.success('Member added');
            setShow(false);
          }}
        >

          {({ values, handleChange, handleSubmit, handleBlur, errors, touched }) => (

            <form onSubmit={handleSubmit}>

              <Modal.Header closeButton>
                <Modal.Title>Add Team Member</Modal.Title>
              </Modal.Header>

              <Modal.Body>

                <div className="mb-3">
                  <label>Name</label>
                  <input
                    name="name"
                    className="form-control"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched.name && errors.name && (
                    <div className="text-danger">{errors.name}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label>Email</label>
                  <input
                    name="email"
                    className="form-control"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched.email && errors.email && (
                    <div className="text-danger">{errors.email}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label>Department</label>
                  <input
                    name="department"
                    className="form-control"
                    value={values.department}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched.department && errors.department && (
                    <div className="text-danger">{errors.department}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched.password && errors.password && (
                    <div className="text-danger">{errors.password}</div>
                  )}
                </div>

              </Modal.Body>

              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShow(false)}>
                  Cancel
                </Button>

                <Button type="submit" variant="primary">
                  Add Member
                </Button>
              </Modal.Footer>

            </form>
          )}

        </Formik>

      </Modal>
    </>
  );
}
