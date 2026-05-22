import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { addUser } from '../../redux/slices/userSlice';
import { login } from '../../redux/slices/authSlice';
import { toast } from '../../components/common/Toast';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  // Validation schema inside component file
  const registerSchema = Yup.object({
    name: Yup.string()
      .min(2, 'Name is too short')
      .required('Full name is required'),

    email: Yup.string()
      .email('Enter a valid email')
      .required('Email is required'),

    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .matches(/[A-Z]/, 'Include at least 1 uppercase letter')
      .matches(/[0-9]/, 'Include at least 1 number')
      .required('Password is required'),

    confirm: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords do not match')
      .required('Please confirm your password'),

    role: Yup.string()
      .oneOf(['manager', 'employee'])
      .required('Select a role'),

    department: Yup.string()
      .required('Department is required'),
  });

  const handleRegister = (values, { setSubmitting }) => {
    try {
      const action = dispatch(
        addUser({
          name: values.name,
          email: values.email,
          password: values.password,
          role: values.role,
          department: values.department,
        })
      );

      const user = action.payload;

      dispatch(
        login({
          user,
          remember: true,
        })
      );

      toast.success('Welcome to TaskFlow!', user.name);

      if (user.role === 'manager') {
        navigate('/manager/dashboard');
      } else {
        navigate('/employee/dashboard');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="tf-auth">
      <div className="tf-auth-card">

        <h3>Create account</h3>

        <p className="sub">
          Get started with TaskFlow in seconds
        </p>

        <Formik
          initialValues={{
            name: '',
            email: '',
            password: '',
            confirm: '',
            role: 'employee',
            department: 'Engineering',
          }}
          validationSchema={registerSchema}
          onSubmit={handleRegister}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleSubmit,
            isSubmitting,
          }) => (
            <form onSubmit={handleSubmit} noValidate>

              {/* Name */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Full name
                </label>

                <input
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  className={`form-control ${
                    touched.name && errors.name
                      ? 'is-invalid'
                      : ''
                  }`}
                  placeholder="John Doe"
                />

                {touched.name && errors.name && (
                  <div className="invalid-feedback">
                    {errors.name}
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  className={`form-control ${
                    touched.email && errors.email
                      ? 'is-invalid'
                      : ''
                  }`}
                  placeholder="you@company.com"
                />

                {touched.email && errors.email && (
                  <div className="invalid-feedback">
                    {errors.email}
                  </div>
                )}
              </div>

              {/* Role + Department */}
              <div className="row g-2 mb-3">

                <div className="col-6">
                  <label className="form-label fw-semibold">
                    Role
                  </label>

                  <select
                    name="role"
                    value={values.role}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="employee">
                      Employee
                    </option>

                    <option value="manager">
                      Manager
                    </option>
                  </select>
                </div>

                <div className="col-6">
                  <label className="form-label fw-semibold">
                    Department
                  </label>

                  <select
                    name="department"
                    value={values.department}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option>Engineering</option>
                    <option>Design</option>
                    <option>Marketing</option>
                    <option>Operations</option>
                    <option>Sales</option>
                  </select>
                </div>

              </div>

              {/* Password */}
              <div className="mb-3 position-relative">
                <label className="form-label fw-semibold">
                  Password
                </label>

                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  className={`form-control ${
                    touched.password && errors.password
                      ? 'is-invalid'
                      : ''
                  }`}
                  placeholder="Create a strong password"
                />

                <button
                  type="button"
                  className="tf-pw-toggle"
                  style={{ top: '70%' }}
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  <i
                    className={`bi ${
                      showPassword
                        ? 'bi-eye-slash'
                        : 'bi-eye'
                    }`}
                  />
                </button>

                {touched.password && errors.password && (
                  <div className="invalid-feedback d-block">
                    {errors.password}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Confirm password
                </label>

                <input
                  type="password"
                  name="confirm"
                  value={values.confirm}
                  onChange={handleChange}
                  className={`form-control ${
                    touched.confirm && errors.confirm
                      ? 'is-invalid'
                      : ''
                  }`}
                  placeholder="Re-enter password"
                />

                {touched.confirm && errors.confirm && (
                  <div className="invalid-feedback d-block">
                    {errors.confirm}
                  </div>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary w-100"
              >
                {isSubmitting
                  ? 'Creating account...'
                  : 'Create account'}
              </button>

              {/* Login Link */}
              <div className="text-center mt-3 small text-muted">
                Already have an account?{' '}
                <Link to="/login">
                  Sign in
                </Link>
              </div>

            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}