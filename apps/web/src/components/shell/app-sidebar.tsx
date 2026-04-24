import type { ReactNode } from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SidebarSectionItem = {
  key: string;
  label: string;
  icon?: ReactNode;
  active?: boolean;
  onSelect: () => void;
};

type SidebarSection = {
  label: string;
  items: SidebarSectionItem[];
};

type AppSidebarProps = {
  collapsed: boolean;
  pinned: boolean;
  onTogglePinned: () => void;
  onExpand: () => void;
  onCollapse: () => void;
  brand: ReactNode;
  account: ReactNode;
  usage: ReactNode;
  sections: SidebarSection[];
  footerAction: ReactNode;
};

export function AppSidebar({
  collapsed,
  pinned,
  onTogglePinned,
  onExpand,
  onCollapse,
  brand,
  account,
  usage,
  sections,
  footerAction,
}: AppSidebarProps) {
  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-screen shrink-0 border-r border-[var(--ds-color-border)] bg-white transition-[width] duration-200 lg:flex lg:flex-col",
        collapsed ? "w-[88px]" : "w-[312px]",
      )}
      onMouseEnter={() => {
        if (!pinned) onExpand();
      }}
      onMouseLeave={() => {
        if (!pinned) onCollapse();
      }}
    >
      <div className="flex h-full flex-col gap-6 px-4 py-5">
        <div className="flex items-center justify-between gap-3">
          <div className={cn("min-w-0", collapsed ? "flex-1" : "flex-1")}>{brand}</div>
          <Button
            type="button"
            variant="quiet"
            size="icon"
            onClick={onTogglePinned}
            aria-label={collapsed ? "Fijar navegación abierta" : "Colapsar navegación"}
          >
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </Button>
        </div>

        <div
          className={cn(
            "space-y-4 overflow-hidden transition-opacity duration-200",
            collapsed ? "opacity-0 pointer-events-none h-0" : "opacity-100",
          )}
        >
          {account}
          {usage}
        </div>

        <nav className="flex-1 space-y-6" aria-label="Navegación de la aplicación">
          {sections.map((section) => (
            <div key={section.label} className="space-y-2">
              <div
                className={cn(
                  "px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--ds-color-text-subtle)]",
                  collapsed && "sr-only",
                )}
              >
                {section.label}
              </div>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={item.onSelect}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-[var(--ds-radius-sm)] px-3 py-2.5 text-left text-sm font-medium transition-colors",
                      item.active
                        ? "bg-[var(--ds-color-brand-soft)] text-[var(--ds-color-brand)]"
                        : "text-[var(--ds-color-text-muted)] hover:bg-[var(--ds-color-surface-subtle)] hover:text-[var(--ds-color-text)]",
                      collapsed && "justify-center px-0",
                    )}
                    aria-current={item.active ? "page" : undefined}
                  >
                    <span className="shrink-0">{item.icon}</span>
                    <span className={cn("truncate", collapsed && "sr-only")}>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className={cn(collapsed && "flex justify-center")}>{footerAction}</div>
      </div>
    </aside>
  );
}
