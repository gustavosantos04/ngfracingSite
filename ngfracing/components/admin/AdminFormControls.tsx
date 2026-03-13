"use client";

import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  idleLabel: string;
  pendingLabel: string;
  className?: string;
};

export function AdminSubmitButton({ idleLabel, pendingLabel, className = "button-primary" }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className={className} disabled={pending} aria-busy={pending}>
      <span className={`button-spinner ${pending ? "is-visible" : ""}`} aria-hidden="true" />
      <span>{pending ? pendingLabel : idleLabel}</span>
    </button>
  );
}

export function AdminPendingState({ copy = "Salvando dados. Aguarde..." }: { copy?: string }) {
  const { pending } = useFormStatus();

  if (!pending) {
    return null;
  }

  return (
    <div className="form-feedback form-feedback-pending" role="status" aria-live="polite">
      {copy}
    </div>
  );
}

