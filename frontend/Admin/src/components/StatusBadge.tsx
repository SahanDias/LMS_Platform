import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

const statusStyles: Record<string, string> = {
  published: "bg-success/10 text-success border-success/20",
  active: "bg-success/10 text-success border-success/20",
  ACTIVE: "bg-success/10 text-success border-success/20",
  succeeded: "bg-success/10 text-success border-success/20",
  draft: "bg-warning/10 text-warning border-warning/20",
  pending: "bg-warning/10 text-warning border-warning/20",
  inactive: "bg-muted text-muted-foreground border-border",
  INACTIVE: "bg-muted text-muted-foreground border-border",
  archived: "bg-muted text-muted-foreground border-border",
  expired: "bg-destructive/10 text-destructive border-destructive/20",
  failed: "bg-destructive/10 text-destructive border-destructive/20",
  revoked: "bg-destructive/10 text-destructive border-destructive/20",
  refunded: "bg-info/10 text-info border-info/20",
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  return (
    <Badge variant="outline" className={`capitalize text-xs font-medium ${statusStyles[status] || ""}`}>
      {status}
    </Badge>
  );
};

export default StatusBadge;
