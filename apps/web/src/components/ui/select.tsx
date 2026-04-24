import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ className, children, ...props }, ref) => {
  return (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          "flex h-11 w-full appearance-none rounded-[var(--ds-radius-sm)] border border-[var(--ds-color-border)] bg-white px-3 pr-10 text-sm text-[var(--ds-color-text)] shadow-[var(--ds-shadow-xs)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-color-info)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ds-color-text-subtle)]"
        aria-hidden="true"
      />
    </div>
  );
});

Select.displayName = "Select";

export { Select };
