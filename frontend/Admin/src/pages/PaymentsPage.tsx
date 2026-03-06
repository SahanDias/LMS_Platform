import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import StatusBadge from "@/components/StatusBadge";
import { paymentsApi } from "@/services/api";
import { Payment } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Eye, RotateCcw, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PaymentsPage = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Payment | null>(null);
  const { toast } = useToast();

  const load = () => paymentsApi.getAll().then(setPayments);
  useEffect(() => { load(); }, []);

  const filtered = payments.filter((p) =>
    p.userName.toLowerCase().includes(search.toLowerCase()) ||
    p.courseName.toLowerCase().includes(search.toLowerCase()) ||
    p.stripePaymentId.toLowerCase().includes(search.toLowerCase())
  );

  const handleRefund = async (id: string) => {
    await paymentsApi.refund(id);
    toast({ title: "Payment refunded" });
    load();
    setSelected(null);
  };

  const totalRevenue = payments.filter(p => p.status === "succeeded").reduce((s, p) => s + p.amount, 0);
  const totalRefunded = payments.filter(p => p.status === "refunded").reduce((s, p) => s + p.amount, 0);

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Payments</h1>
          <p className="text-sm text-muted-foreground mt-1">Track and manage Stripe payments</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="border rounded-xl p-4 bg-card shadow-sm">
          <p className="text-sm text-muted-foreground">Successful Revenue</p>
          <p className="text-xl font-bold text-success mt-1">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="border rounded-xl p-4 bg-card shadow-sm">
          <p className="text-sm text-muted-foreground">Refunded</p>
          <p className="text-xl font-bold text-destructive mt-1">${totalRefunded.toFixed(2)}</p>
        </div>
        <div className="border rounded-xl p-4 bg-card shadow-sm">
          <p className="text-sm text-muted-foreground">Total Transactions</p>
          <p className="text-xl font-bold mt-1">{payments.length}</p>
        </div>
      </div>

      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search payments..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="border rounded-xl overflow-hidden bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Stripe ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <div>
                    <p className="font-medium text-sm">{p.userName}</p>
                    <p className="text-xs text-muted-foreground">{p.userEmail}</p>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{p.courseName}</TableCell>
                <TableCell className="font-medium">${p.amount}</TableCell>
                <TableCell className="text-sm">
                  <div className="flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-muted-foreground" />
                    {p.method}
                  </div>
                </TableCell>
                <TableCell className="text-xs font-mono text-muted-foreground">{p.stripePaymentId}</TableCell>
                <TableCell className="text-sm">{new Date(p.createdAt).toLocaleDateString()}</TableCell>
                <TableCell><StatusBadge status={p.status} /></TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => setSelected(p)}><Eye className="w-4 h-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-muted-foreground">Student</p><p className="font-medium">{selected.userName}</p></div>
                <div><p className="text-muted-foreground">Email</p><p className="font-medium">{selected.userEmail}</p></div>
                <div><p className="text-muted-foreground">Course</p><p className="font-medium">{selected.courseName}</p></div>
                <div><p className="text-muted-foreground">Amount</p><p className="font-medium">${selected.amount} {selected.currency}</p></div>
                <div><p className="text-muted-foreground">Method</p><p className="font-medium">{selected.method}</p></div>
                <div><p className="text-muted-foreground">Stripe ID</p><p className="font-mono text-xs">{selected.stripePaymentId}</p></div>
                <div><p className="text-muted-foreground">Date</p><p className="font-medium">{new Date(selected.createdAt).toLocaleString()}</p></div>
                <div><p className="text-muted-foreground">Status</p><StatusBadge status={selected.status} /></div>
              </div>
              {selected.status === "succeeded" && (
                <Button variant="destructive" className="w-full" onClick={() => handleRefund(selected.id)}>
                  <RotateCcw className="w-4 h-4 mr-2" />Issue Refund
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default PaymentsPage;
