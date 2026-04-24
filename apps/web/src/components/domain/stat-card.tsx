import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type StatCardProps = {
  value: ReactNode;
  label: string;
  description?: string;
  className?: string;
};

export function StatCard({ value, label, description, className }: StatCardProps) {
  return (
    <article
      className={cn(
        "rounded-[var(--ds-radius-lg)] border border-[var(--ds-color-border)] bg-white p-5 shadow-[var(--ds-shadow-xs)]",
        className,
      )}
    >
      <strong className="block text-3xl font-semibold text-[var(--ds-color-text)]">{value}</strong>
      <span className="mt-2 block text-sm font-medium text-[var(--ds-color-text)]">{label}</span>
      {description ? (
        <p className="mt-2 text-sm leading-6 text-[var(--ds-color-text-muted)]">{description}</p>
      ) : null}
    </article>
  );
}
