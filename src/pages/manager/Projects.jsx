import { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';

import PageHeader from '../../components/common/PageHeader';
import Avatar from '../../components/common/Avatar';
import { StatusBadge } from '../../components/common/StatusBadge';

import {
  addProject,
  updateProject,
  deleteProject,
} from '../../redux/slices/projectSlice';

import { toast } from '../../components/common/Toast';
import { fmtDate } from '../../utils/helpers';

export default function Projects() {
  const dispatch = useDispatch();

  const projects = useSelector((state) => state.projects.list);
  const users = useSelector((state) => state.users.list);
  const tasks = useSelector((state) => state.tasks.list);

  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Yup validation 
  const projectSchema = Yup.object({
    name: Yup.string()
      .min(2, 'Project name is too short')
      .required('Project name is required'),

    description: Yup.string().max(
      400,
      'Description cannot exceed 400 characters'
    ),

    deadline: Yup.date().required(
      'Deadline is required'
    ),

    status: Yup.string()
      .oneOf([
        'Todo',
        'In Progress',
        'Review',
        'Done',
      ])
      .required('Select project status'),
  });

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesStatus =
        statusFilter === 'All' ||
        project.status === statusFilter;

      const matchesSearch =
        project.name
          .toLowerCase()
          .includes(search.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [projects, search, statusFilter]);

  const openModal = (project = null) => {
    setEditingProject(project);
    setShowModal(true);
  };

  const closeModal = () => {
    setEditingProject(null);
    setShowModal(false);
  };

  const getTaskCount = (projectId) => {
    return tasks.filter(
      (task) => task.projectId === projectId
    ).length;
  };

  const handleDelete = (projectId) => {
    dispatch(deleteProject(projectId));

    toast.success('Project deleted successfully');
  };

  return (
    <>
      {/* page header start */}
      <PageHeader
        title="Projects"
        subtitle="Plan and manage all projects from one place"
        crumbs={[
          { label: 'Manager' },
          { label: 'Projects' },
        ]}
        actions={
          <Button onClick={() => openModal()}>
            <i className="bi bi-plus-lg me-1"></i>
            New Project
          </Button>
        }
      />
      {/* page header end */}

      {/* Filters */}
      <div className="tf-card mb-3">
        <div className="tf-card-body d-flex gap-2 flex-wrap">
          {/* Search */}
          <div className="position-relative flex-grow-1" style={{ maxWidth: 360 }}>
            <i className="bi bi-search position-absolute"
              style={{
                left: '.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--tf-muted)',
              }}
            ></i>

            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="form-control "
              style={{ paddingLeft: '2.2rem' }}
            />
          </div>

          {/* Status Filter */}
          <select
            className="form-select"
            style={{ maxWidth: 180 }}
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <option>All</option>
            <option>Todo</option>
            <option>In Progress</option>
            <option>Review</option>
            <option>Done</option>
          </select>
        </div>
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 ? (
        <div className="tf-empty text-center py-5">
          <i
            className="bi bi-folder2-open"
            style={{
              fontSize: '2.5rem',
              opacity: 0.6,
            }}
          ></i>

          <h5 className="mt-3">
            No projects found
          </h5>

          <p className="text-muted mb-0">
            Try adjusting your filters or create
            a new project.
          </p>
        </div>
      ) : (
        <div className="row g-3">

          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="col-12 col-md-6 col-xl-4"
            >
              <div className="tf-card h-100">
                <div className="tf-card-body">

                  {/* Header */}
                  <div className="d-flex justify-content-between align-items-start mb-2">

                    <div>
                      <h6
                        className="mb-1"
                        style={{ fontWeight: 700 }}
                      >
                        {project.name}
                      </h6>

                      <StatusBadge
                        status={project.status}
                      />
                    </div>

                    {/* Working Dropdown */}
                    <div className="d-flex gap-2">

                      <button
                        className="btn btn-sm btn-light"
                        onClick={() => openModal(project)}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>

                      <button
                        className="btn btn-sm btn-light text-danger"
                        onClick={() => handleDelete(project.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>

                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-muted small">
                    {project.description}
                  </p>

                  {/* Progress */}
                  <div className="d-flex justify-content-between small text-muted mb-1">
                    <span>Progress</span>
                    <span>
                      {project.progress}%
                    </span>
                  </div>

                  <div className="tf-progress mb-3">
                    <div
                      style={{
                        width:
                          project.progress + '%',
                      }}
                    ></div>
                  </div>

                  {/* Members + Date */}
                  <div className="d-flex justify-content-between align-items-center">

                    <div className="tf-avatar-stack">
                      {project.members
                        .slice(0, 4)
                        .map((memberId) => {
                          const user =
                            users.find(
                              (u) =>
                                u.id === memberId
                            );

                          return (
                            <Avatar
                              key={memberId}
                              user={user}
                              size="sm"
                            />
                          );
                        })}
                    </div>

                    <div className="small text-muted">
                      <i className="bi bi-calendar-event me-1"></i>
                      {fmtDate(project.deadline)}
                    </div>
                  </div>

                  {/* Task Count */}
                  <div className="small text-muted mt-2">
                    <i className="bi bi-check2-square me-1"></i>
                    {getTaskCount(project.id)} tasks
                  </div>

                </div>
              </div>
            </div>
          ))}

        </div>
      )}

      {/* Modal Start*/}
      <Modal
        show={showModal}
        onHide={closeModal}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editingProject
              ? 'Edit Project'
              : 'Create Project'}
          </Modal.Title>
        </Modal.Header>

        <Formik
          initialValues={
            editingProject || {
              name: '',
              description: '',
              deadline: '',
              status: 'Todo',
              progress: 0,
              members: [],
            }
          }
          validationSchema={projectSchema}
          enableReinitialize
          onSubmit={(values) => {
            if (editingProject) {
              dispatch(updateProject(values));

              toast.success(
                'Project updated successfully'
              );
            } else {
              dispatch(addProject(values));

              toast.success(
                'Project created successfully'
              );
            }

            closeModal();
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleSubmit,
          }) => (
            <form onSubmit={handleSubmit}>

              <Modal.Body>

                {/* Project Name */}
                <div className="mb-3">
                  <label className="form-label">
                    Project Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    className={`form-control ${touched.name &&
                      errors.name
                      ? 'is-invalid'
                      : ''
                      }`}
                  />

                  {touched.name &&
                    errors.name && (
                      <div className="invalid-feedback">
                        {errors.name}
                      </div>
                    )}
                </div>

                {/* Description */}
                <div className="mb-3">
                  <label className="form-label">
                    Description
                  </label>

                  <textarea
                    rows={3}
                    name="description"
                    value={
                      values.description || ''
                    }
                    onChange={handleChange}
                    className="form-control"
                  ></textarea>
                </div>

                <div className="row g-2">

                  {/* Deadline */}
                  <div className="col-6">
                    <label className="form-label">
                      Deadline
                    </label>

                    <input
                      type="date"
                      name="deadline"
                      value={
                        values.deadline || ''
                      }
                      onChange={handleChange}
                      className={`form-control ${touched.deadline &&
                        errors.deadline
                        ? 'is-invalid'
                        : ''
                        }`}
                    />

                    {touched.deadline &&
                      errors.deadline && (
                        <div className="invalid-feedback">
                          {String(
                            errors.deadline
                          )}
                        </div>
                      )}
                  </div>

                  {/* Status */}
                  <div className="col-6">
                    <label className="form-label">
                      Status
                    </label>

                    <select
                      name="status"
                      value={values.status}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option>Todo</option>
                      <option>
                        In Progress
                      </option>
                      <option>Review</option>
                      <option>Done</option>
                    </select>
                  </div>
                </div>

                {/* Progress */}
                <div className="mt-3">
                  <label className="form-label">
                    Progress:{' '}
                    {values.progress || 0}%
                  </label>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    name="progress"
                    value={
                      values.progress || 0
                    }
                    onChange={handleChange}
                    className="form-range"
                  />
                </div>

                {/* Members */}
                <div className="mt-3">
                  <label className="form-label">
                    Team Members
                  </label>

                  <select
                    multiple
                    name="members"
                    value={
                      values.members || []
                    }
                    className="form-select"
                    style={{ minHeight: 120 }}
                    onChange={(e) => {
                      const selected =
                        Array.from(
                          e.target.selectedOptions
                        ).map(
                          (option) =>
                            option.value
                        );

                      handleChange({
                        target: {
                          name: 'members',
                          value: selected,
                        },
                      });
                    }}
                  >
                    {users
                      .filter(
                        (user) =>
                          user.role ===
                          'employee'
                      )
                      .map((user) => (
                        <option
                          key={user.id}
                          value={user.id}
                        >
                          {user.name} —{' '}
                          {user.department}
                        </option>
                      ))}
                  </select>
                </div>

              </Modal.Body>

              <Modal.Footer>
                <Button
                  variant="light"
                  onClick={closeModal}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="primary"
                >
                  {editingProject
                    ? 'Save Changes'
                    : 'Create Project'}
                </Button>
              </Modal.Footer>

            </form>
          )}
        </Formik>
      </Modal>
      {/* Modal End */}
    </>
  );
}