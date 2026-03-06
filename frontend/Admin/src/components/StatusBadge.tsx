import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

const statusStyles: Record<string, string> = {
  published: "bg-success/10 text-success border-success/20 hover:bg-success/20",
  active: "bg-success/10 text-success border-success/20 hover:bg-success/20",
  ACTIVE: "bg-success/10 text-success border-success/20 hover:bg-success/20",
  succeeded: "bg-success/10 text-success border-success/20 hover:bg-success/20",
  SUCCESS: "bg-success/10 text-success border-success/20 hover:bg-success/20",
  draft: "bg-warning/10 text-warning border-warning/20 hover:bg-warning/20",
  pending: "bg-warning/10 text-warning border-warning/20 hover:bg-warning/20",
  PENDING: "bg-warning/10 text-warning border-warning/20 hover:bg-warning/20",
  inactive: "bg-muted text-muted-foreground border-border hover:bg-muted/80",
  INACTIVE: "bg-muted text-muted-foreground border-border hover:bg-muted/80",
  archived: "bg-muted text-muted-foreground border-border hover:bg-muted/80",
  expired: "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20",
  failed: "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20",
  FAILED: "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20",
  revoked: "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20",
  refunded: "bg-info/10 text-info border-info/20 hover:bg-info/20",
  REFUNDED: "bg-info/10 text-info border-info/20 hover:bg-info/20",
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  return (
    <Badge className={`capitalize text-xs font-semibold ${statusStyles[status] || "bg-muted text-muted-foreground border-border"}`}>
      {status}
    </Badge>
  );
};

export default StatusBadge;
