import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-11 w-full rounded-[var(--ds-radius-sm)] border border-[var(--ds-color-border)] bg-white px-3 text-sm text-[var(--ds-color-text)] shadow-[var(--ds-shadow-xs)] transition-colors placeholder:text-[var(--ds-color-text-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-color-info)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };
