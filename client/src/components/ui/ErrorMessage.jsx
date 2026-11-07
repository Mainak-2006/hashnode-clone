export default function ErrorMessage({ message, onRetry, className = '' }) {
  if (!message) return null;

  return (
    <div className={`alert alert--error ${className}`} role="alert">
      <span className="alert__icon" aria-hidden="true">
        !
      </span>
      <div className="alert__body">
        <p>{message}</p>
        {onRetry && (
          <button type="button" className="btn btn--ghost btn--sm" onClick={onRetry}>
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
