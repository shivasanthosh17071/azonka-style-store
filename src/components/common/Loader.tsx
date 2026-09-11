interface LoaderProps {
  /** Caption under the mark. Defaults to "Loading". */
  label?: string;
  /** Pins the loader to the viewport instead of just filling its container. */
  fullScreen?: boolean;
  className?: string;
}

/**
 * Branded loading state: the wordmark sheens like light catching fabric while a
 * thread runs the length of the rule beneath it. Used for any full-view wait —
 * route guards, lazy chunks, page-level fetches — swap SkeletonCard in for
 * loading *within* an already-visible layout (product grids, etc).
 */
export function Loader({ label = "Loading", fullScreen = false, className = "" }: LoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      className={`flex flex-col items-center justify-center gap-5 ${fullScreen ? "min-h-screen" : "min-h-[40vh]"} ${className}`}
    >
      <span
        className="bg-[linear-gradient(110deg,var(--ink)_38%,var(--brick)_50%,var(--ink)_62%)] bg-[length:220%_100%] bg-clip-text font-display text-4xl tracking-wide text-transparent [animation:brand-sheen_1.8s_linear_infinite]"
        aria-hidden="true"
      >
        RAGYAI_m
      </span>
      <span className="h-px w-24 overflow-hidden bg-line">
        <span className="block h-full w-8 bg-brick [animation:brand-thread_1.3s_ease-in-out_infinite]" />
      </span>
      <span className="text-[10px] uppercase tracking-[0.35em] text-ink-soft">{label}</span>
    </div>
  );
}
