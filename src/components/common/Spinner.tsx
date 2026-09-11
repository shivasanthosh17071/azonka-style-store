interface SpinnerProps {
  className?: string;
}

/** Small inline spinner for buttons/links mid-request. For full-view waits, use Loader instead. */
export function Spinner({ className = "" }: SpinnerProps) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block size-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
    />
  );
}
