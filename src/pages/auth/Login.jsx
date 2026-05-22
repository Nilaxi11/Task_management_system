import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { attemptLogin } from '../../redux/slices/authSlice';
import { toast } from '../../components/common/Toast';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  // Validation schema 
  const loginSchema = Yup.object({
    email: Yup.string()
      .email('Please enter a valid email')
      .required('Email is required'),

    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  const handleLogin = (values, { setSubmitting, setStatus }) => {
    try {
      const user = dispatch(attemptLogin(values));

      toast.success('Welcome back!', user.name);

      if (user.role === 'manager') {
        navigate('/manager/dashboard');
      } else {
        navigate('/employee/dashboard');
      }
    } catch (error) {
      setStatus(error.message);
      toast.error('Login failed', error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="tf-auth">
      <div className="tf-auth-card">

        {/* Logo */}
        <div className="d-flex align-items-center gap-2 mb-4">
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: 'linear-gradient(135deg,#1677ff,#0b1f3a)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
            }}
          >
            TF
          </div>

          <div>
            <strong
              style={{
                fontSize: '1.1rem',
                color: '#0b1f3a',
              }}
            >
              TaskFlow
            </strong>
          </div>
        </div>

        <h3>Welcome back</h3>
        <p className="sub">
          Sign in to continue to your workspace
        </p>

        <Formik
          initialValues={{
            email: '',
            password: '',
            remember: true,
          }}
          validationSchema={loginSchema}
          onSubmit={handleLogin}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleSubmit,
            status,
            isSubmitting,
          }) => (
            <form onSubmit={handleSubmit} noValidate>

              {/* Email */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="you@company.com"
                  value={values.email}
                  onChange={handleChange}
                  className={`form-control ${
                    touched.email && errors.email ? 'is-invalid' : ''
                  }`}
                />

                {touched.email && errors.email && (
                  <div className="invalid-feedback">
                    {errors.email}
                  </div>
                )}
              </div>

              {/* Password */}
              <div className="mb-3 position-relative">
                <label className="form-label fw-semibold">
                  Password
                </label>

                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  // placeholder="••••••••"
                  value={values.password}
                  onChange={handleChange}
                  className={`form-control ${
                    touched.password && errors.password
                      ? 'is-invalid'
                      : ''
                  }`}
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

              {/* Remember + Forgot */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="form-check">
                  <input
                    id="rememberMe"
                    type="checkbox"
                    name="remember"
                    checked={values.remember}
                    onChange={handleChange}
                    className="form-check-input"
                  />

                  <label
                    htmlFor="rememberMe"
                    className="form-check-label small"
                  >
                    Remember me
                  </label>
                </div>

                <a
                  href="#"
                  className="small text-decoration-none"
                >
                  Forgot password?
                </a>
              </div>

              {/* Error */}
              {status && (
                <div className="alert alert-danger py-2 small">
                  {status}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary w-100"
              >
                {isSubmitting
                  ? 'Signing in...'
                  : 'Sign In'}
              </button>

              {/* Register */}
              <div className="text-center mt-3 small text-muted">
                Don&apos;t have an account?{' '}
                <Link to="/register">
                  Register
                </Link>
              </div>

              {/* Demo Accounts */}
              <div
                className="mt-3 p-2 rounded"
                style={{
                  background: '#f1f5f9',
                  fontSize: '.72rem',
                  color: '#475569',
                }}
              >
                <strong>Demo Accounts:</strong>
                <br />
                manager@demo.com / Password1
                <br />
                employee@demo.com / Password1
              </div>

            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}