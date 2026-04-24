import { Badge } from "@/components/ui/badge";

type OperationalBadgeProps = {
  label: string;
  tone: "info" | "warning" | "error" | "success" | "neutral";
};

export function OperationalBadge({ label, tone }: OperationalBadgeProps) {
  return <Badge variant={tone}>{label}</Badge>;
}
