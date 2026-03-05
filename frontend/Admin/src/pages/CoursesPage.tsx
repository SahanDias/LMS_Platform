import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import StatusBadge from "@/components/StatusBadge";
import { coursesApi } from "@/services/api";
import { Course } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CourseForm {
  courseCode: string;
  title: string;
  description: string;
  thumbnailImgUrl: string;
  price: number;
  passingPercentage: number;
  certificationEnabled: boolean;
  isFree: boolean;
  status: "ACTIVE" | "INACTIVE";
}

const emptyForm: CourseForm = {
  courseCode: "",
  title: "",
  description: "",
  thumbnailImgUrl: "",
  price: 0,
  passingPercentage: 70,
  certificationEnabled: true,
  isFree: false,
  status: "INACTIVE",
};

const CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [form, setForm] = useState<CourseForm>(emptyForm);
  const { toast } = useToast();

  const load = () => coursesApi.getAll().then(setCourses).catch(() => {
    toast({ title: "Failed to load courses", variant: "destructive" });
  });
  useEffect(() => { load(); }, []);

  const filtered = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.courseCode.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => { setEditing(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (c: Course) => {
    setEditing(c);
    setForm({
      courseCode: c.courseCode,
      title: c.title,
      description: c.description,
      thumbnailImgUrl: c.thumbnailImgUrl,
      price: c.price,
      passingPercentage: c.passingPercentage,
      certificationEnabled: c.certificationEnabled,
      isFree: c.isFree,
      status: c.status,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await coursesApi.update(editing.id, form);
        toast({ title: "Course updated" });
      } else {
        await coursesApi.create(form);
        toast({ title: "Course created" });
      }
      setDialogOpen(false);
      load();
    } catch {
      toast({ title: "Failed to save course", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await coursesApi.delete(id);
      toast({ title: "Course deleted" });
      load();
    } catch {
      toast({ title: "Failed to delete course", variant: "destructive" });
    }
  };

  const handleFreeToggle = (checked: boolean) => {
    setForm({ ...form, isFree: checked, price: checked ? 0 : form.price });
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Courses</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage all courses</p>
        </div>
        <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" />Add Course</Button>
      </div>

      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search by title or code..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="border rounded-xl overflow-hidden bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Free</TableHead>
              <TableHead>Certification</TableHead>
              <TableHead>Passing %</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-mono text-sm">{c.courseCode}</TableCell>
                <TableCell className="font-medium">{c.title}</TableCell>
                <TableCell>{c.isFree ? "—" : `$${c.price.toFixed(2)}`}</TableCell>
                <TableCell>{c.isFree ? "Yes" : "No"}</TableCell>
                <TableCell>{c.certificationEnabled ? "Yes" : "No"}</TableCell>
                <TableCell>{c.passingPercentage}%</TableCell>
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
            <DialogTitle>{editing ? "Edit Course" : "New Course"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Course Code</Label>
                <Input placeholder="e.g. CS-101" value={form.courseCode} onChange={(e) => setForm({ ...form, courseCode: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v: string) => setForm({ ...form, status: v as "ACTIVE" | "INACTIVE" })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Thumbnail Image URL</Label>
              <Input placeholder="https://..." value={form.thumbnailImgUrl} onChange={(e) => setForm({ ...form, thumbnailImgUrl: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Price ($)</Label>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="is-free" className="text-sm text-muted-foreground">Free</Label>
                    <Switch id="is-free" checked={form.isFree} onCheckedChange={handleFreeToggle} />
                  </div>
                </div>
                <Input type="number" min={0} step={0.01} value={form.price} disabled={form.isFree} onChange={(e) => setForm({ ...form, price: +e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Passing Percentage (%)</Label>
                <Input type="number" min={0} max={100} value={form.passingPercentage} onChange={(e) => setForm({ ...form, passingPercentage: +e.target.value })} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch id="cert-enabled" checked={form.certificationEnabled} onCheckedChange={(checked) => setForm({ ...form, certificationEnabled: checked })} />
              <Label htmlFor="cert-enabled">Certification Enabled</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? "Save Changes" : "Create Course"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default CoursesPage;
