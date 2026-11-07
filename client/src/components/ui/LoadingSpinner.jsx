export default function LoadingSpinner({ label = 'Loading…', inline = false }) {
  if (inline) {
    return <span className="spinner spinner--inline" role="status" aria-label={label} />;
  }

  return (
    <div className="loading-state" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <p>{label}</p>
    </div>
  );
}
