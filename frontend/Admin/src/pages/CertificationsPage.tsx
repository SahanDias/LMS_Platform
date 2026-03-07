import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import StatusBadge from "@/components/StatusBadge";
import { certificationsApi } from "@/services/api";
import { Certification } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const emptyForm: { title: string; courseId: string; courseName: string; issuedTo: string; issuedAt: string; expiresAt: string; status: "active" | "expired" | "revoked" } = { title: "", courseId: "", courseName: "", issuedTo: "", issuedAt: "", expiresAt: "", status: "active" };

const CertificationsPage = () => {
  const [certs, setCerts] = useState<Certification[]>([]);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Certification | null>(null);
  const [form, setForm] = useState(emptyForm);
  const { toast } = useToast();

  const load = () => certificationsApi.getAll().then(setCerts);
  useEffect(() => { load(); }, []);

  const filtered = certs.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()) || c.issuedTo.toLowerCase().includes(search.toLowerCase()));

  const openCreate = () => { setEditing(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (c: Certification) => { setEditing(c); setForm({ title: c.title, courseId: c.courseId, courseName: c.courseName, issuedTo: c.issuedTo, issuedAt: c.issuedAt, expiresAt: c.expiresAt || "", status: c.status as "active" | "expired" | "revoked" }); setDialogOpen(true); };

  const handleSave = async () => {
    if (editing) {
      await certificationsApi.update(editing.id, { ...form, expiresAt: form.expiresAt || null });
      toast({ title: "Certification updated" });
    } else {
      await certificationsApi.create({ ...form, expiresAt: form.expiresAt || null });
      toast({ title: "Certification created" });
    }
    setDialogOpen(false);
    load();
  };

  const handleDelete = async (id: string) => {
    await certificationsApi.delete(id);
    toast({ title: "Certification deleted" });
    load();
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Certifications</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage issued certifications</p>
        </div>
        <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" />Add Certification</Button>
      </div>

      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search certifications..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="border rounded-xl overflow-hidden bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Issued To</TableHead>
              <TableHead>Issued At</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.title}</TableCell>
                <TableCell className="text-muted-foreground">{c.courseName}</TableCell>
                <TableCell>{c.issuedTo}</TableCell>
                <TableCell>{c.issuedAt}</TableCell>
                <TableCell>{c.expiresAt || "—"}</TableCell>
                <TableCell><StatusBadge status={c.status} /></TableCell>
                <TableCell className="text-right space-x-1">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(c)}><Pencil className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(c.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Certification" : "New Certification"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Course ID</Label><Input value={form.courseId} onChange={(e) => setForm({ ...form, courseId: e.target.value })} /></div>
              <div className="space-y-2"><Label>Course Name</Label><Input value={form.courseName} onChange={(e) => setForm({ ...form, courseName: e.target.value })} /></div>
            </div>
            <div className="space-y-2"><Label>Issued To</Label><Input value={form.issuedTo} onChange={(e) => setForm({ ...form, issuedTo: e.target.value })} /></div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2"><Label>Issued At</Label><Input type="date" value={form.issuedAt} onChange={(e) => setForm({ ...form, issuedAt: e.target.value })} /></div>
              <div className="space-y-2"><Label>Expires At</Label><Input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} /></div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v: string) => setForm({ ...form, status: v as "active" | "expired" | "revoked" })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="revoked">Revoked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? "Save Changes" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default CertificationsPage;
