import type { ReactNode } from "react";

type DetailSectionProps = {
  title: string;
  meta?: string;
  children: ReactNode;
};

export function DetailSection({ title, meta, children }: DetailSectionProps) {
  return (
    <section className="rounded-[var(--ds-radius-md)] border border-[var(--ds-color-border)] bg-[var(--ds-color-surface-subtle)] p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <strong className="text-base text-[var(--ds-color-text)]">{title}</strong>
        {meta ? <span className="text-sm text-[var(--ds-color-text-muted)]">{meta}</span> : null}
      </div>
      {children}
    </section>
  );
}
