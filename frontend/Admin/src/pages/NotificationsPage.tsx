import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { notificationsApi, type Notification } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, RefreshCw, Bell, CheckCircle, CreditCard, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [selected, setSelected] = useState<Notification | null>(null);
  const [syncing, setSyncing] = useState(false);
  const { toast } = useToast();

  const load = (type?: string) => {
    const filterType = type ?? typeFilter;
    notificationsApi
      .getAll(filterType === "ALL" ? undefined : filterType)
      .then(setNotifications)
      .catch(() => {
        toast({ title: "Failed to load notifications", variant: "destructive" });
      });
  };

  useEffect(() => {
    load();
  }, []);

  const handleFilterChange = (type: string) => {
    setTypeFilter(type);
    load(type);
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      await notificationsApi.sync();
      toast({ title: "Sync triggered successfully" });
      load();
    } catch {
      toast({ title: "Sync failed", variant: "destructive" });
    } finally {
      setSyncing(false);
    }
  };

  const filtered = notifications.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.message.toLowerCase().includes(search.toLowerCase()) ||
      n.badgeLabel.toLowerCase().includes(search.toLowerCase())
  );

  const completionCount = notifications.filter((n) => n.type === "COMPLETION").length;
  const paymentCount = notifications.filter((n) => n.type === "PAYMENT").length;

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-sm text-muted-foreground mt-1">
            View and manage system notifications
          </p>
        </div>
        <Button onClick={handleSync} disabled={syncing} variant="outline" className="gap-2">
          <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
          {syncing ? "Syncing..." : "Sync Now"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="border rounded-xl p-4 bg-card shadow-sm">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Total Notifications</p>
          </div>
          <p className="text-xl font-bold mt-1">{notifications.length}</p>
        </div>
        <div className="border rounded-xl p-4 bg-card shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-success" />
            <p className="text-sm text-muted-foreground">Course Completions</p>
          </div>
          <p className="text-xl font-bold text-success mt-1">{completionCount}</p>
        </div>
        <div className="border rounded-xl p-4 bg-card shadow-sm">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-primary" />
            <p className="text-sm text-muted-foreground">Payment Notifications</p>
          </div>
          <p className="text-xl font-bold text-primary mt-1">{paymentCount}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search notifications..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-1">
          <Filter className="w-4 h-4 text-muted-foreground mr-1" />
          {["ALL", "COMPLETION", "PAYMENT"].map((type) => (
            <Button
              key={type}
              variant={typeFilter === type ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange(type)}
            >
              {type === "ALL" ? "All" : type === "COMPLETION" ? "Completions" : "Payments"}
            </Button>
          ))}
        </div>
      </div>

      <div className="border rounded-xl overflow-hidden bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Badge</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No notifications found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((n) => (
                <TableRow key={`${n.type}-${n.id}`}>
                  <TableCell>
                    <Badge
                      className={
                        n.type === "COMPLETION"
                          ? "bg-success/10 text-success border-success/20"
                          : "bg-primary/10 text-primary border-primary/20"
                      }
                    >
                      {n.type === "COMPLETION" ? (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      ) : (
                        <CreditCard className="w-3 h-3 mr-1" />
                      )}
                      {n.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium text-sm">{n.title}</TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                    {n.message}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {n.badgeLabel}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(n.timestamp).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        n.read
                          ? "bg-muted text-muted-foreground border-border"
                          : "bg-warning/10 text-warning border-warning/20"
                      }
                    >
                      {n.read ? "Read" : "Unread"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => setSelected(n)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Notification Details</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {selected.type === "COMPLETION" ? (
                  <CheckCircle className="w-5 h-5 text-success" />
                ) : (
                  <CreditCard className="w-5 h-5 text-primary" />
                )}
                <Badge
                  className={
                    selected.type === "COMPLETION"
                      ? "bg-success/10 text-success border-success/20"
                      : "bg-primary/10 text-primary border-primary/20"
                  }
                >
                  {selected.type}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Title</p>
                  <p className="font-medium">{selected.title}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Badge</p>
                  <p className="font-medium">{selected.badgeLabel}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">Message</p>
                  <p className="font-medium">{selected.message}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p className="font-medium">
                    {new Date(selected.timestamp).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <Badge
                    className={
                      selected.read
                        ? "bg-muted text-muted-foreground border-border"
                        : "bg-warning/10 text-warning border-warning/20"
                    }
                  >
                    {selected.read ? "Read" : "Unread"}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default NotificationsPage;
