import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  badge?: ReactNode;
  meta?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  badge,
  meta,
  action,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-20 flex flex-col gap-4 border-b border-[var(--ds-color-border)] bg-[color:rgb(247_249_252_/_0.9)] px-6 py-5 backdrop-blur supports-[backdrop-filter]:bg-[color:rgb(247_249_252_/_0.72)] lg:flex-row lg:items-start lg:justify-between lg:px-8",
        className,
      )}
    >
      <div className="max-w-3xl space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--ds-color-text-subtle)]">
            {eyebrow}
          </span>
          {badge}
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--ds-color-text)]">{title}</h1>
          <p className="max-w-2xl text-sm leading-6 text-[var(--ds-color-text-muted)]">{description}</p>
        </div>
      </div>

      <div className="flex w-full flex-col items-start gap-3 lg:w-auto lg:min-w-[280px] lg:items-end">
        {meta}
        {action}
      </div>
    </header>
  );
}
