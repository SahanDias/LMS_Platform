import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import StatusBadge from "@/components/StatusBadge";
import { quizzesApi } from "@/services/api";
import { Quiz } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const emptyForm: { title: string; courseId: string; courseName: string; questionsCount: number; duration: number; passingScore: number; status: "active" | "inactive" } = { title: "", courseId: "", courseName: "", questionsCount: 10, duration: 30, passingScore: 60, status: "active" };

const QuizzesPage = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Quiz | null>(null);
  const [form, setForm] = useState(emptyForm);
  const { toast } = useToast();

  const load = () => quizzesApi.getAll().then(setQuizzes);
  useEffect(() => { load(); }, []);

  const filtered = quizzes.filter((q) => q.title.toLowerCase().includes(search.toLowerCase()));

  const openCreate = () => { setEditing(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (q: Quiz) => { setEditing(q); setForm({ title: q.title, courseId: q.courseId, courseName: q.courseName, questionsCount: q.questionsCount, duration: q.duration, passingScore: q.passingScore, status: q.status as "active" | "inactive" }); setDialogOpen(true); };

  const handleSave = async () => {
    if (editing) {
      await quizzesApi.update(editing.id, form);
      toast({ title: "Quiz updated" });
    } else {
      await quizzesApi.create(form);
      toast({ title: "Quiz created" });
    }
    setDialogOpen(false);
    load();
  };

  const handleDelete = async (id: string) => {
    await quizzesApi.delete(id);
    toast({ title: "Quiz deleted" });
    load();
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Quizzes</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage assessments and quizzes</p>
        </div>
        <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" />Add Quiz</Button>
      </div>

      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search quizzes..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="border rounded-xl overflow-hidden bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Questions</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Pass Score</TableHead>
              <TableHead>Attempts</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((q) => (
              <TableRow key={q.id}>
                <TableCell className="font-medium">{q.title}</TableCell>
                <TableCell className="text-muted-foreground">{q.courseName}</TableCell>
                <TableCell>{q.questionsCount}</TableCell>
                <TableCell>{q.duration} min</TableCell>
                <TableCell>{q.passingScore}%</TableCell>
                <TableCell>{q.attemptsCount}</TableCell>
                <TableCell><StatusBadge status={q.status} /></TableCell>
                <TableCell className="text-right space-x-1">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(q)}><Pencil className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(q.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Quiz" : "New Quiz"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Course ID</Label><Input value={form.courseId} onChange={(e) => setForm({ ...form, courseId: e.target.value })} /></div>
              <div className="space-y-2"><Label>Course Name</Label><Input value={form.courseName} onChange={(e) => setForm({ ...form, courseName: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2"><Label>Questions</Label><Input type="number" value={form.questionsCount} onChange={(e) => setForm({ ...form, questionsCount: +e.target.value })} /></div>
              <div className="space-y-2"><Label>Duration (min)</Label><Input type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: +e.target.value })} /></div>
              <div className="space-y-2"><Label>Pass Score (%)</Label><Input type="number" value={form.passingScore} onChange={(e) => setForm({ ...form, passingScore: +e.target.value })} /></div>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v: string) => setForm({ ...form, status: v as "active" | "inactive" })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? "Save Changes" : "Create Quiz"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default QuizzesPage;
