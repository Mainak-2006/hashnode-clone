import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import AuthLayout from '../components/auth/AuthLayout';
import ErrorMessage from '../components/ui/ErrorMessage';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import useAuth from '../hooks/useAuth';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { getErrorMessage, isValidEmail } from '../utils/errors';

const FORM = 'mt-[30px] flex flex-col gap-[18px]';
const FIELD = 'flex flex-col gap-[7px]';
const LABEL = 'text-[0.86rem] font-semibold text-slate-700';
const INPUT =
  'h-full min-w-0 flex-1 border-0 bg-transparent text-[0.95rem] text-ink-900 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:text-slate-500';
const TOGGLE =
  'grid size-9 -mr-1.5 cursor-pointer place-items-center rounded-[9px] border-0 bg-transparent text-slate-400 hover:bg-slate-100 hover:text-slate-700';
const ERROR = 'text-[0.8rem] text-red-700';
const BTN_PRIMARY =
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-transparent bg-[linear-gradient(100deg,var(--color-brand-500),var(--color-violet-500))] px-[18px] py-[11px] text-[0.94rem] font-semibold whitespace-nowrap text-white no-underline shadow-brand transition-all duration-150 hover:-translate-y-px hover:text-white hover:no-underline hover:shadow-brand-lg active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-65 disabled:hover:translate-y-0';

const controlClass = (error) =>
  `flex h-12 items-center gap-2.5 rounded-xl border px-3.5 text-slate-400 transition-[border-color,box-shadow] focus-within:text-brand-600 ${
    error
      ? 'border-red-200 bg-red-50 focus-within:border-red-700 focus-within:shadow-ring-danger'
      : 'border-slate-200 bg-white focus-within:border-brand-500 focus-within:shadow-ring'
  }`;

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
      <div className={FIELD}>
        <label htmlFor={name} className={LABEL}>
          {label}
        </label>
        <div className={controlClass(error)}>
          <Icon size={17} aria-hidden="true" />
          <input
            id={name}
            name={name}
            type={resolvedType}
            autoComplete={autoComplete}
            placeholder={placeholder}
            className={INPUT}
            value={values[name]}
            onChange={handleChange}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${name}-error` : undefined}
            disabled={submitting}
          />
          {isPassword && (
            <button
              type="button"
              className={TOGGLE}
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          )}
        </div>
        {error && (
          <p className={ERROR} id={`${name}-error`}>
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
      <form className={FORM} onSubmit={handleSubmit} noValidate>
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

        <button type="submit" className={`${BTN_PRIMARY} w-full`} disabled={submitting}>
          {submitting ? (
            <>
              <LoadingSpinner inline label="Creating account" />
              Creating account…
            </>
          ) : (
            'Create account'
          )}
        </button>

        <p className="m-0 text-center text-[0.78rem] leading-[1.5] text-slate-400">
          By creating an account you agree to keep the platform friendly and the code well formatted.
        </p>
      </form>
    </AuthLayout>
  );
}
