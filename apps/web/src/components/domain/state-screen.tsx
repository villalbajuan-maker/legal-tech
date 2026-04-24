import type { ReactNode } from "react";

type StateScreenProps = {
  eyebrow: string;
  title: string;
  description: ReactNode;
  children?: ReactNode;
};

export function StateScreen({ eyebrow, title, description, children }: StateScreenProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--ds-color-background)] px-6 py-10">
      <section className="w-full max-w-[560px] rounded-[var(--ds-radius-lg)] border border-[var(--ds-color-border)] bg-white p-8 shadow-[var(--ds-shadow-md)]">
        <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--ds-color-text-subtle)]">
          {eyebrow}
        </span>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--ds-color-text)]">{title}</h1>
        <div className="mt-4 space-y-4 text-sm leading-6 text-[var(--ds-color-text-muted)]">{description}</div>
        {children ? <div className="mt-6">{children}</div> : null}
      </section>
    </main>
  );
}
