import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
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
      <form className={FORM} onSubmit={handleSubmit} noValidate>
        <ErrorMessage message={formError} />

        <div className={FIELD}>
          <label htmlFor="email" className={LABEL}>
            Email address
          </label>
          <div className={controlClass(fieldErrors.email)}>
            <Mail size={17} aria-hidden="true" />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className={INPUT}
              value={values.email}
              onChange={handleChange}
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? 'email-error' : undefined}
              disabled={submitting}
            />
          </div>
          {fieldErrors.email && (
            <p className={ERROR} id="email-error">
              {fieldErrors.email}
            </p>
          )}
        </div>

        <div className={FIELD}>
          <label htmlFor="password" className={LABEL}>
            Password
          </label>
          <div className={controlClass(fieldErrors.password)}>
            <Lock size={17} aria-hidden="true" />
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Your password"
              className={INPUT}
              value={values.password}
              onChange={handleChange}
              aria-invalid={Boolean(fieldErrors.password)}
              aria-describedby={fieldErrors.password ? 'password-error' : undefined}
              disabled={submitting}
            />
            <button
              type="button"
              className={TOGGLE}
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {fieldErrors.password && (
            <p className={ERROR} id="password-error">
              {fieldErrors.password}
            </p>
          )}
        </div>

        <button type="submit" className={`${BTN_PRIMARY} w-full`} disabled={submitting}>
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
