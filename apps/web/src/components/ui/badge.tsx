import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.04em]",
  {
    variants: {
      variant: {
        neutral:
          "border-[var(--ds-color-border)] bg-[var(--ds-color-surface-subtle)] text-[var(--ds-color-text-muted)]",
        info:
          "border-[var(--ds-color-info-border)] bg-[var(--ds-color-info-soft)] text-[var(--ds-color-info)]",
        success:
          "border-[var(--ds-color-success-border)] bg-[var(--ds-color-success-soft)] text-[var(--ds-color-success)]",
        warning:
          "border-[var(--ds-color-warning-border)] bg-[var(--ds-color-warning-soft)] text-[var(--ds-color-warning)]",
        error:
          "border-[var(--ds-color-error-border)] bg-[var(--ds-color-error-soft)] text-[var(--ds-color-error)]",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

type BadgeProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, className }))} {...props} />;
}
