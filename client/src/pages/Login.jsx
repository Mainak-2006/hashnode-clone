import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import AuthLayout from '../components/auth/AuthLayout';
import ErrorMessage from '../components/ui/ErrorMessage';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import useAuth from '../hooks/useAuth';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { getErrorMessage, isValidEmail } from '../utils/errors';

export default function Login() {
  useDocumentTitle('Log in');
  const { login, isAuthenticated, initializing } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.from || '/dashboard';

  const [values, setValues] = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!initializing && isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: '' }));
    setFormError('');
  };

  const validate = () => {
    const errors = {};
    if (!values.email.trim()) errors.email = 'Email is required.';
    else if (!isValidEmail(values.email)) errors.email = 'Enter a valid email address.';
    if (!values.password) errors.password = 'Password is required.';
    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      await login({ email: values.email.trim(), password: values.password });
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setFormError(getErrorMessage(error, 'Could not log you in. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to manage your articles and continue writing."
      footer={
        <p>
          New to Hashnode Clone? <Link to="/register">Create an account</Link>
        </p>
      }
    >
      <form className="form" onSubmit={handleSubmit} noValidate>
        <ErrorMessage message={formError} />

        <div className="field">
          <label htmlFor="email">Email address</label>
          <div className={`field__control${fieldErrors.email ? ' field__control--error' : ''}`}>
            <Mail size={17} aria-hidden="true" />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={values.email}
              onChange={handleChange}
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? 'email-error' : undefined}
              disabled={submitting}
            />
          </div>
          {fieldErrors.email && (
            <p className="field__error" id="email-error">
              {fieldErrors.email}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <div className={`field__control${fieldErrors.password ? ' field__control--error' : ''}`}>
            <Lock size={17} aria-hidden="true" />
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Your password"
              value={values.password}
              onChange={handleChange}
              aria-invalid={Boolean(fieldErrors.password)}
              aria-describedby={fieldErrors.password ? 'password-error' : undefined}
              disabled={submitting}
            />
            <button
              type="button"
              className="field__toggle"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {fieldErrors.password && (
            <p className="field__error" id="password-error">
              {fieldErrors.password}
            </p>
          )}
        </div>

        <button type="submit" className="btn btn--primary btn--block" disabled={submitting}>
          {submitting ? (
            <>
              <LoadingSpinner inline label="Logging in" />
              Logging in…
            </>
          ) : (
            'Log in'
          )}
        </button>
      </form>
    </AuthLayout>
  );
}
