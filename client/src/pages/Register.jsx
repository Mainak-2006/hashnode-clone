import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import AuthLayout from '../components/auth/AuthLayout';
import ErrorMessage from '../components/ui/ErrorMessage';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import useAuth from '../hooks/useAuth';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { getErrorMessage, isValidEmail } from '../utils/errors';

export default function Register() {
  useDocumentTitle('Create account');
  const { register, isAuthenticated, initializing } = useAuth();
  const navigate = useNavigate();

  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!initializing && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: '' }));
    setFormError('');
  };

  const validate = () => {
    const errors = {};

    if (!values.name.trim()) errors.name = 'Name is required.';
    else if (values.name.trim().length < 2) errors.name = 'Name must be at least 2 characters.';

    if (!values.email.trim()) errors.email = 'Email is required.';
    else if (!isValidEmail(values.email)) errors.email = 'Enter a valid email address.';

    if (!values.password) errors.password = 'Password is required.';
    else if (values.password.length < 6) errors.password = 'Password must be at least 6 characters.';

    if (!values.confirmPassword) errors.confirmPassword = 'Please confirm your password.';
    else if (values.confirmPassword !== values.password) {
      errors.confirmPassword = 'Passwords do not match.';
    }

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
      await register({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
      });
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setFormError(getErrorMessage(error, 'Could not create your account. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  const input = (name, label, type, placeholder, Icon, autoComplete) => {
    const error = fieldErrors[name];
    const isPassword = name === 'password' || name === 'confirmPassword';
    const resolvedType = isPassword && showPassword ? 'text' : type;

    return (
      <div className={`field${isPassword ? ' field--password' : ''}`}>
        <label htmlFor={name}>{label}</label>
        <div className={`field__control${error ? ' field__control--error' : ''}`}>
          <Icon size={17} aria-hidden="true" />
          <input
            id={name}
            name={name}
            type={resolvedType}
            autoComplete={autoComplete}
            placeholder={placeholder}
            value={values[name]}
            onChange={handleChange}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${name}-error` : undefined}
            disabled={submitting}
          />
          {isPassword && (
            <button
              type="button"
              className="field__toggle"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          )}
        </div>
        {error && (
          <p className="field__error" id={`${name}-error`}>
            {error}
          </p>
        )}
      </div>
    );
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start publishing technical articles in minutes."
      footer={
        <p>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      }
    >
      <form className="form" onSubmit={handleSubmit} noValidate>
        <ErrorMessage message={formError} />

        {input('name', 'Full name', 'text', 'Ada Lovelace', User, 'name')}
        {input('email', 'Email address', 'email', 'you@example.com', Mail, 'email')}
        {input('password', 'Password', 'password', 'At least 6 characters', Lock, 'new-password')}
        {input(
          'confirmPassword',
          'Confirm password',
          'password',
          'Repeat your password',
          Lock,
          'new-password'
        )}

        <button type="submit" className="btn btn--primary btn--block" disabled={submitting}>
          {submitting ? (
            <>
              <LoadingSpinner inline label="Creating account" />
              Creating account…
            </>
          ) : (
            'Create account'
          )}
        </button>

        <p className="form__note">
          By creating an account you agree to keep the platform friendly and the code well formatted.
        </p>
      </form>
    </AuthLayout>
  );
}
