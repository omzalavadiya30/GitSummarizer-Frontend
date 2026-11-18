import { useId } from "react";

/** Label + control + error message, wired together for accessibility. */
export function Field({
  label,
  error,
  hint,
  action,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  /** Optional element on the label row (e.g. "Forgot password?"). */
  action?: React.ReactNode;
  children: (ids: { id: string; describedBy?: string; invalid: boolean }) => React.ReactNode;
}) {
  const id = useId();
  const errId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [error && errId, hint && hintId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
        {action}
      </div>
      {children({ id, describedBy, invalid: !!error })}
      {hint && !error && (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={errId} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
    >
      {message}
    </p>
  );
}
