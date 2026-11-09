import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Eye,
  FileText,
  Image as ImageIcon,
  Loader2,
  Save,
  Send,
  Undo2,
} from 'lucide-react';
import MarkdownEditor from '../components/markdown/MarkdownEditor';
import TagInput from '../components/posts/TagInput';
import ErrorMessage from '../components/ui/ErrorMessage';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { createPost, getMyPostById, updatePost } from '../api/posts';
import { listTags } from '../api/tags';
import useAuth from '../hooks/useAuth';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { getErrorMessage } from '../utils/errors';
import { formatDate } from '../utils/format';

const BTN_PRIMARY =
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-transparent bg-[linear-gradient(100deg,var(--color-brand-500),var(--color-violet-500))] px-5 py-2.5 text-[0.9rem] font-semibold whitespace-nowrap text-white no-underline shadow-brand transition-all duration-150 hover:-translate-y-px hover:text-white hover:no-underline hover:shadow-brand-lg active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0';

const BTN_GHOST =
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-[0.9rem] font-semibold whitespace-nowrap text-slate-700 no-underline shadow-soft transition-all duration-150 hover:border-slate-300 hover:bg-slate-50 hover:text-ink-900 hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-60';

const PANEL = 'rounded-[18px] border border-slate-200 bg-white p-5 shadow-soft';
const LABEL = 'mb-2 block text-[0.84rem] font-semibold text-slate-700';
const INPUT =
  'h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-[0.92rem] text-ink-900 outline-none transition-[border-color,box-shadow] placeholder:text-slate-400 focus:border-brand-500 focus:shadow-ring';

const isValidHttpUrl = (value) => {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

const EMPTY_FORM = { title: '', content: '', coverImage: '' };

export default function PostEditor() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState(EMPTY_FORM);
  const [tags, setTags] = useState([]);
  const [status, setStatus] = useState('draft');
  const [suggestions, setSuggestions] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loadError, setLoadError] = useState('');
  const [loading, setLoading] = useState(isEditing);
  const [savingAction, setSavingAction] = useState('');
  const [coverFailed, setCoverFailed] = useState(false);

  useDocumentTitle(isEditing ? 'Edit post' : 'New post');

  const loadPost = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setLoadError('');
    try {
      const { post } = await getMyPostById(id);
      setForm({
        title: post.title || '',
        content: post.content || '',
        coverImage: post.coverImage || '',
      });
      setTags((post.tags || []).map((tag) => tag.name));
      setStatus(post.status || 'draft');
    } catch (error) {
      setLoadError(getErrorMessage(error, 'Could not load this post.'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  useEffect(() => {
    let cancelled = false;
    listTags()
      .then(({ tags: fetched }) => {
        if (!cancelled) setSuggestions(fetched || []);
      })
      .catch(() => {
        if (!cancelled) setSuggestions([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const wordCount = useMemo(
    () => (form.content.trim() ? form.content.trim().split(/\s+/).length : 0),
    [form.content]
  );

  const updateField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: '' }));
    setFormError('');
  };

  const validate = () => {
    const errors = {};

    if (!form.title.trim()) errors.title = 'A title is required.';
    else if (form.title.trim().length > 150) errors.title = 'Keep the title under 150 characters.';

    if (!form.content.trim()) errors.content = 'Post content is required.';

    if (form.coverImage.trim() && !isValidHttpUrl(form.coverImage.trim())) {
      errors.coverImage = 'Use a valid http(s) image URL.';
    }

    if (tags.length > 5) errors.tags = 'A post can have at most 5 tags.';

    return errors;
  };

  const save = async (nextStatus) => {
    setFormError('');
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setFormError('Please fix the highlighted fields before saving.');
      return;
    }

    setSavingAction(nextStatus);
    const payload = {
      title: form.title.trim(),
      content: form.content,
      coverImage: form.coverImage.trim(),
      tags,
      status: nextStatus,
    };

    try {
      if (isEditing) {
        await updatePost(id, payload);
      } else {
        await createPost(payload);
      }

      navigate('/dashboard', {
        replace: true,
        state: {
          notice:
            nextStatus === 'published'
              ? isEditing
                ? 'Post updated and published.'
                : 'Post published successfully.'
              : isEditing
                ? 'Draft saved.'
                : 'Draft created. Publish it when you are ready.',
        },
      });
    } catch (error) {
      setFormError(getErrorMessage(error, 'Could not save this post. Please try again.'));
    } finally {
      setSavingAction('');
    }
  };

  if (loading) {
    return (
      <div className="grid min-h-[calc(100vh-70px)] place-items-center px-6 py-14">
        <LoadingSpinner label="Loading your post…" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="mx-auto w-full max-w-[720px] px-6 py-14 max-md:px-[18px]">
        <Link to="/dashboard" className={`${BTN_GHOST} mb-6`}>
          <ArrowLeft size={16} aria-hidden="true" />
          Back to dashboard
        </Link>
        <ErrorMessage message={loadError} onRetry={loadPost} />
      </div>
    );
  }

  const busy = Boolean(savingAction);
  const isPublished = status === 'published';

  return (
    <div className="mx-auto w-full max-w-[1160px] px-6 pt-10 pb-[72px] max-md:px-[18px] max-[560px]:pt-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className={BTN_GHOST}>
            <ArrowLeft size={16} aria-hidden="true" />
            Dashboard
          </Link>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.73rem] font-bold uppercase tracking-[0.04em] ${
              isPublished ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
            }`}
          >
            <span
              className={`size-1.5 rounded-full ${isPublished ? 'bg-emerald-500' : 'bg-amber-500'}`}
              aria-hidden="true"
            />
            {isPublished ? 'Published' : 'Draft'}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {isPublished ? (
            <button
              type="button"
              className={BTN_GHOST}
              onClick={() => save('draft')}
              disabled={busy}
            >
              <Undo2 size={16} aria-hidden="true" />
              {savingAction === 'draft' ? 'Unpublishing…' : 'Unpublish'}
            </button>
          ) : (
            <button type="button" className={BTN_GHOST} onClick={() => save('draft')} disabled={busy}>
              <Save size={16} aria-hidden="true" />
              {savingAction === 'draft' ? 'Saving…' : 'Save draft'}
            </button>
          )}
          <button type="button" className={BTN_PRIMARY} onClick={() => save('published')} disabled={busy}>
            {savingAction === 'published' ? (
              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            ) : (
              <Send size={16} aria-hidden="true" />
            )}
            {isPublished ? 'Update post' : 'Publish'}
          </button>
        </div>
      </div>

      <header className="mb-6">
        <p className="mb-1.5 text-[0.74rem] font-bold uppercase tracking-[0.14em] text-brand-600">
          {isEditing ? 'Editing post' : 'New post'}
        </p>
        <h1 className="text-[clamp(1.6rem,3vw,2.15rem)] font-extrabold">
          {isEditing ? 'Edit your article' : 'Write something worth reading'}
        </h1>
        <p className="mt-2 text-[0.94rem] text-slate-500">
          Markdown, tags, and a cover image — save privately as a draft or publish to the public feed.
        </p>
      </header>

      <ErrorMessage message={formError} className="mb-5" />

      <div className="grid grid-cols-[minmax(0,1fr)_320px] items-start gap-5 max-lg:grid-cols-1">
        <div className="flex min-w-0 flex-col gap-5">
          <section className={PANEL} aria-labelledby="basics-heading">
            <h2 id="basics-heading" className="mb-4 text-[1rem] font-bold">
              Post basics
            </h2>

            <div className="mb-5">
              <label htmlFor="post-title" className={LABEL}>
                Title
              </label>
              <input
                id="post-title"
                type="text"
                className={`${INPUT} h-12 text-[1.05rem] font-semibold ${
                  fieldErrors.title ? 'border-red-300 bg-red-50' : ''
                }`}
                value={form.title}
                maxLength={150}
                placeholder="A clear, specific title"
                onChange={(event) => updateField('title', event.target.value)}
                aria-invalid={Boolean(fieldErrors.title)}
                aria-describedby={fieldErrors.title ? 'post-title-error' : undefined}
                disabled={busy}
              />
              <div className="mt-1.5 flex items-center justify-between gap-3 text-[0.78rem]">
                {fieldErrors.title ? (
                  <span className="text-red-700" id="post-title-error">
                    {fieldErrors.title}
                  </span>
                ) : (
                  <span className="text-slate-400">Keep it under 150 characters.</span>
                )}
                <span className="text-slate-400">{form.title.length}/150</span>
              </div>
            </div>

            <div>
              <label htmlFor="post-content" className={LABEL}>
                Content
              </label>
              <MarkdownEditor
                id="post-content"
                label="Markdown body"
                value={form.content}
                onChange={(value) => updateField('content', value)}
                rows={18}
                error={fieldErrors.content}
                hint="Ctrl/Cmd + B, I, E, or K applies bold, italic, inline code, or a link."
                disabled={busy}
              />
              <p className="mt-1.5 text-[0.78rem] text-slate-400">{wordCount} words</p>
            </div>
          </section>
        </div>

        <aside className="flex flex-col gap-5 max-lg:order-first">
          <section className={PANEL} aria-labelledby="publishing-heading">
            <h2 id="publishing-heading" className="mb-4 flex items-center gap-2 text-[1rem] font-bold">
              <FileText size={17} className="text-brand-600" aria-hidden="true" />
              Publishing
            </h2>

            <dl className="flex flex-col gap-2.5 text-[0.84rem]">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-slate-500">Status</dt>
                <dd className="m-0 font-semibold text-ink-900 capitalize">{status}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-slate-500">Author</dt>
                <dd className="m-0 truncate font-semibold text-ink-900">{user?.name}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-slate-500">Updated</dt>
                <dd className="m-0 font-semibold text-ink-900">{formatDate(new Date())}</dd>
              </div>
            </dl>

            <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4">
              <button type="button" className={BTN_PRIMARY} onClick={() => save('published')} disabled={busy}>
                {savingAction === 'published' ? (
                  <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                ) : (
                  <Send size={16} aria-hidden="true" />
                )}
                {isPublished ? 'Update post' : 'Publish post'}
              </button>
              {isPublished ? (
                <button type="button" className={BTN_GHOST} onClick={() => save('draft')} disabled={busy}>
                  <Undo2 size={16} aria-hidden="true" />
                  {savingAction === 'draft' ? 'Unpublishing…' : 'Unpublish'}
                </button>
              ) : (
                <button type="button" className={BTN_GHOST} onClick={() => save('draft')} disabled={busy}>
                  <Save size={16} aria-hidden="true" />
                  {savingAction === 'draft' ? 'Saving…' : 'Save as draft'}
                </button>
              )}
            </div>
          </section>

          <section className={PANEL} aria-labelledby="tags-heading">
            <h2 id="tags-heading" className="mb-1 text-[1rem] font-bold">
              Tags
            </h2>
            <p className="mb-3 text-[0.8rem] text-slate-500">Up to 5 tags help readers find this post.</p>
            <TagInput
              id="post-tags"
              value={tags}
              onChange={setTags}
              suggestions={suggestions}
              error={fieldErrors.tags}
              hint={`${tags.length}/5 tags`}
              disabled={busy}
            />
          </section>

          <section className={PANEL} aria-labelledby="cover-heading">
            <h2 id="cover-heading" className="mb-1 flex items-center gap-2 text-[1rem] font-bold">
              <ImageIcon size={17} className="text-brand-600" aria-hidden="true" />
              Cover image
            </h2>
            <p className="mb-3 text-[0.8rem] text-slate-500">Paste an image URL. Optional.</p>
            <label className="sr-only" htmlFor="post-cover">
              Cover image URL
            </label>
            <input
              id="post-cover"
              type="url"
              className={`${INPUT} ${fieldErrors.coverImage ? 'border-red-300 bg-red-50' : ''}`}
              value={form.coverImage}
              placeholder="https://images.example.com/cover.jpg"
              onChange={(event) => {
                setCoverFailed(false);
                updateField('coverImage', event.target.value);
              }}
              aria-invalid={Boolean(fieldErrors.coverImage)}
              aria-describedby={fieldErrors.coverImage ? 'post-cover-error' : undefined}
              disabled={busy}
            />
            {fieldErrors.coverImage && (
              <p className="mt-1.5 text-[0.8rem] text-red-700" id="post-cover-error">
                {fieldErrors.coverImage}
              </p>
            )}

            {form.coverImage.trim() && isValidHttpUrl(form.coverImage.trim()) && !coverFailed && (
              <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
                <img
                  src={form.coverImage.trim()}
                  alt="Cover preview"
                  className="aspect-[16/9] w-full object-cover"
                  onError={() => setCoverFailed(true)}
                />
              </div>
            )}
            {coverFailed && (
              <p className="mt-2 text-[0.78rem] text-amber-700">
                That image could not be loaded. Check the URL.
              </p>
            )}
          </section>

          <section className="rounded-[18px] border border-slate-200 bg-slate-50 p-5 text-[0.82rem] text-slate-500">
            <h2 className="mb-2 flex items-center gap-2 text-[0.94rem] font-bold text-ink-900">
              <Eye size={16} className="text-brand-600" aria-hidden="true" />
              Preview before publishing
            </h2>
            <p>
              Switch to the <strong>Preview</strong> tab in the editor to check Markdown, tables, and
              highlighted code. Drafts are never visible to the public.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}
