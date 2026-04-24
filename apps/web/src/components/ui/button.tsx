import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[var(--ds-radius-sm)] text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-color-info)] focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--ds-color-brand)] text-white hover:bg-[var(--ds-color-brand-hover)]",
        secondary:
          "border border-[var(--ds-color-border)] bg-white text-[var(--ds-color-brand)] hover:bg-[var(--ds-color-brand-soft)]",
        quiet:
          "bg-transparent text-[var(--ds-color-text-muted)] hover:bg-[var(--ds-color-surface-subtle)] hover:text-[var(--ds-color-brand)]",
        danger:
          "bg-[var(--ds-color-error)] text-white hover:bg-[#c92d33]",
      },
      size: {
        sm: "h-9 px-3",
        md: "h-11 px-4",
        lg: "h-12 px-5",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
