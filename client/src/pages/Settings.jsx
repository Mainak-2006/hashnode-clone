import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Mail, Save, UserRound } from 'lucide-react';
import Avatar from '../components/ui/Avatar';
import ErrorMessage from '../components/ui/ErrorMessage';
import Notice from '../components/ui/Notice';
import { updateMyProfile } from '../api/users';
import useAuth from '../hooks/useAuth';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { getErrorMessage, isValidEmail } from '../utils/errors';
import { formatLongDate, profilePath } from '../utils/format';

const BTN_PRIMARY =
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-transparent bg-[linear-gradient(100deg,var(--color-brand-500),var(--color-violet-500))] px-5 py-2.5 text-[0.9rem] font-semibold whitespace-nowrap text-white no-underline shadow-brand transition-all duration-150 hover:-translate-y-px hover:text-white hover:no-underline hover:shadow-brand-lg active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-60';

const BTN_GHOST =
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-[0.9rem] font-semibold whitespace-nowrap text-slate-700 no-underline shadow-soft transition-all duration-150 hover:border-slate-300 hover:bg-slate-50 hover:text-ink-900 hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-60';

const PANEL = 'rounded-[18px] border border-slate-200 bg-white p-6 shadow-soft max-[560px]:p-5';
const LABEL = 'mb-2 block text-[0.84rem] font-semibold text-slate-700';
const INPUT =
  'w-full rounded-xl border border-slate-200 bg-white px-3.5 text-[0.92rem] text-ink-900 outline-none transition-[border-color,box-shadow] placeholder:text-slate-400 focus:border-brand-500 focus:shadow-ring disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500';

const isValidHttpUrl = (value) => {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

export default function Settings() {
  useDocumentTitle('Settings');
  const { user, updateUser } = useAuth();

  const [values, setValues] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    avatarUrl: user?.avatarUrl || '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setValues({
      name: user?.name || '',
      bio: user?.bio || '',
      avatarUrl: user?.avatarUrl || '',
    });
  }, [user?.name, user?.bio, user?.avatarUrl]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: '' }));
    setFormError('');
    setNotice('');
  };

  const validate = () => {
    const errors = {};
    const name = values.name.trim();

    if (!name) errors.name = 'Name is required.';
    else if (name.length < 2) errors.name = 'Name must be at least 2 characters.';
    else if (name.length > 60) errors.name = 'Name cannot be longer than 60 characters.';

    if (values.bio.trim().length > 200) errors.bio = 'Bio cannot be longer than 200 characters.';

    if (values.avatarUrl.trim() && !isValidHttpUrl(values.avatarUrl.trim())) {
      errors.avatarUrl = 'Use a valid http(s) image URL.';
    }

    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');
    setNotice('');

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSaving(true);
    try {
      const data = await updateMyProfile({
        name: values.name.trim(),
        bio: values.bio.trim(),
        avatarUrl: values.avatarUrl.trim(),
      });
      updateUser(data.user);
      setNotice('Profile updated successfully.');
    } catch (err) {
      setFormError(getErrorMessage(err, 'Could not save your profile.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[900px] px-6 pt-10 pb-[76px] max-md:px-[18px] max-[560px]:pt-7">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link to="/dashboard" className={BTN_GHOST}>
          <ArrowLeft size={16} aria-hidden="true" />
          Dashboard
        </Link>
        {user?.id && (
          <Link to={profilePath(user.id)} className={BTN_GHOST}>
            View public profile
          </Link>
        )}
      </div>

      <header className="mb-6">
        <p className="mb-1.5 text-[0.74rem] font-bold uppercase tracking-[0.14em] text-brand-600">
          Account
        </p>
        <h1 className="text-[clamp(1.6rem,3.2vw,2.15rem)] font-extrabold">Profile settings</h1>
        <p className="mt-2 text-[0.94rem] text-slate-500">
          Update the name, bio, and avatar visitors see alongside your published posts.
        </p>
      </header>

      <Notice message={notice} className="mb-5" />
      <ErrorMessage message={formError} className="mb-5" />

      <div className="grid grid-cols-[minmax(0,1fr)_280px] items-start gap-5 max-lg:grid-cols-1">
        <form className={PANEL} onSubmit={handleSubmit} noValidate>
          <h2 className="mb-5 flex items-center gap-2 text-[1.05rem] font-bold">
            <UserRound size={18} className="text-brand-600" aria-hidden="true" />
            Public profile
          </h2>

          <div className="mb-5">
            <label htmlFor="settings-name" className={LABEL}>
              Display name
            </label>
            <input
              id="settings-name"
              name="name"
              type="text"
              className={`${INPUT} h-11 ${fieldErrors.name ? 'border-red-300 bg-red-50' : ''}`}
              value={values.name}
              maxLength={60}
              onChange={handleChange}
              aria-invalid={Boolean(fieldErrors.name)}
              aria-describedby={fieldErrors.name ? 'settings-name-error' : undefined}
              disabled={saving}
            />
            <div className="mt-1.5 flex items-center justify-between gap-3 text-[0.78rem]">
              {fieldErrors.name ? (
                <span className="text-red-700" id="settings-name-error">
                  {fieldErrors.name}
                </span>
              ) : (
                <span className="text-slate-400">2–60 characters.</span>
              )}
              <span className="text-slate-400">{values.name.length}/60</span>
            </div>
          </div>

          <div className="mb-5">
            <label htmlFor="settings-bio" className={LABEL}>
              Bio
            </label>
            <textarea
              id="settings-bio"
              name="bio"
              rows={4}
              className={`${INPUT} resize-y py-2.5 leading-[1.6] ${
                fieldErrors.bio ? 'border-red-300 bg-red-50' : ''
              }`}
              value={values.bio}
              maxLength={200}
              placeholder="A short note about what you write and build."
              onChange={handleChange}
              aria-invalid={Boolean(fieldErrors.bio)}
              aria-describedby={fieldErrors.bio ? 'settings-bio-error' : undefined}
              disabled={saving}
            />
            <div className="mt-1.5 flex items-center justify-between gap-3 text-[0.78rem]">
              {fieldErrors.bio ? (
                <span className="text-red-700" id="settings-bio-error">
                  {fieldErrors.bio}
                </span>
              ) : (
                <span className="text-slate-400">Shown on your profile and author card.</span>
              )}
              <span className="text-slate-400">{values.bio.length}/200</span>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="settings-avatar" className={LABEL}>
              Avatar image URL
            </label>
            <input
              id="settings-avatar"
              name="avatarUrl"
              type="url"
              className={`${INPUT} h-11 ${fieldErrors.avatarUrl ? 'border-red-300 bg-red-50' : ''}`}
              value={values.avatarUrl}
              placeholder="https://example.com/avatar.jpg"
              onChange={handleChange}
              aria-invalid={Boolean(fieldErrors.avatarUrl)}
              aria-describedby={fieldErrors.avatarUrl ? 'settings-avatar-error' : undefined}
              disabled={saving}
            />
            {fieldErrors.avatarUrl ? (
              <p className="mt-1.5 text-[0.78rem] text-red-700" id="settings-avatar-error">
                {fieldErrors.avatarUrl}
              </p>
            ) : (
              <p className="mt-1.5 text-[0.78rem] text-slate-400">
                Leave blank to use your initials.
              </p>
            )}
          </div>

          <button type="submit" className={BTN_PRIMARY} disabled={saving}>
            <Save size={16} aria-hidden="true" />
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </form>

        <aside className="flex flex-col gap-4">
          <section className={PANEL} aria-labelledby="preview-heading">
            <h2 id="preview-heading" className="mb-4 text-[1rem] font-bold">
              Preview
            </h2>
            <div className="flex items-center gap-3">
              <Avatar
                name={values.name || user?.name}
                src={isValidHttpUrl(values.avatarUrl.trim()) ? values.avatarUrl.trim() : ''}
                size={56}
              />
              <div className="min-w-0">
                <p className="truncate text-[0.95rem] font-bold text-ink-900">
                  {values.name || 'Your name'}
                </p>
                <p className="text-[0.78rem] text-slate-500">Author</p>
              </div>
            </div>
            <p className="mt-3 text-[0.84rem] leading-[1.6] text-slate-500">
              {values.bio || 'Your bio will appear here.'}
            </p>
          </section>

          <section className={PANEL} aria-labelledby="account-heading">
            <h2 id="account-heading" className="mb-4 text-[1rem] font-bold">
              Account
            </h2>
            <dl className="flex flex-col gap-3 text-[0.84rem]">
              <div className="flex items-start gap-2.5">
                <Mail size={16} className="mt-0.5 shrink-0 text-slate-400" aria-hidden="true" />
                <div className="min-w-0">
                  <dt className="text-slate-500">Email</dt>
                  <dd className="m-0 truncate font-semibold text-ink-900">{user?.email}</dd>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <CalendarDays size={16} className="mt-0.5 shrink-0 text-slate-400" aria-hidden="true" />
                <div>
                  <dt className="text-slate-500">Member since</dt>
                  <dd className="m-0 font-semibold text-ink-900">{formatLongDate(user?.createdAt)}</dd>
                </div>
              </div>
            </dl>
            {user?.email && !isValidEmail(user.email) && (
              <p className="mt-3 text-[0.78rem] text-amber-700">Your stored email looks unusual.</p>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}
