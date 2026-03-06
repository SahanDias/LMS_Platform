import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

// CHANGE FORM FIELD NAMES TO MATCH BACKEND
// title -> quizName
// courseName -> classId
// questionsCount -> questionCount
// duration -> timeLimitMinutes
// status values -> "ACTIVE" | "INACTIVE"

type QuizForm = Omit<Quiz, "id" | "attemptsCount">;

interface ClassItem {
  id: string;
  name: string;
  courseId: string;
}

const emptyForm: QuizForm = {
  title: "",
  courseId: "",
  courseName: "",
  questionsCount: 10,
  duration: 30,
  passingScore: 60,
  questionOrder: "SEQUENTIAL",
  examRequirement: "OPTIONAL",
  status: "active",
};

const QuizzesPage = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Quiz | null>(null);
  const [form, setForm] = useState<QuizForm>(emptyForm);
  const [classList, setClassList] = useState<ClassItem[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const load = () => quizzesApi.getAll().then(setQuizzes);
  useEffect(() => {
  load();

  // temporary class list (later connect class service)
  setClassList([
    { id: "1", name: "Class A", courseId: "C1" },
    { id: "2", name: "Class B", courseId: "C2" },
    { id: "3", name: "Class C", courseId: "C3" },
  ]);

}, []);

  // CHANGE SEARCH FIELD IF YOUR TYPE IS UPDATED
  // q.title -> q.quizName
  const filtered = quizzes.filter((q) => q.title.toLowerCase().includes(search.toLowerCase()));

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (q: Quiz) => {
    // CHANGE EDIT MAPPING TO MATCH BACKEND WORDS
    // title: q.title -> quizName: q.quizName
    // courseName: q.courseName -> classId: q.classId
    // questionsCount: q.questionsCount -> questionCount: q.questionCount
    // duration: q.duration -> timeLimitMinutes: q.timeLimitMinutes
    setEditing(q);
    setForm({
      title: q.title,
      courseId: q.courseId,
      courseName: q.courseName,
      questionsCount: q.questionsCount,
      duration: q.duration,
      passingScore: q.passingScore,
      questionOrder: q.questionOrder,
      examRequirement: q.examRequirement,
      status: q.status
    });
    setDialogOpen(true);
  };

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
          {/* CHANGE PAGE TITLE */}
          {/* "Quizzes" -> "Quiz Management" */}
          <h1 className="text-2xl font-bold">Quiz Management</h1>

          {/* CHANGE SUBTITLE */}
          {/* "Manage assessments and quizzes" -> "Manage quizzes" */}
          <p className="text-sm text-muted-foreground mt-1">Manage quizzes</p>
        </div>

        {/* CHANGE BUTTON TEXT */}
        {/* "Add Quiz" -> "Create Quiz" */}
        <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" />Create Quiz</Button>
      </div>

      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search quizzes..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="border rounded-xl overflow-hidden bg-card shadow-sm">
        <Table>
          <TableHeader >
            <TableRow>
              {/* CHANGE TABLE HEADERS TO BACKEND WORDS */}
              {/* Title -> Quiz Name */}
              <TableHead>Quiz Name</TableHead>

              {/* Course -> Course ID */}
              <TableHead>Class Name</TableHead>

              {/* ADD Class ID column if you want full backend alignment */}
              {/* <TableHead>Class ID</TableHead> */}

              {/* Questions -> Question Count */}
              <TableHead>Question Count</TableHead>

              {/* Duration -> Time Limit */}
              <TableHead>Time Limit</TableHead>

              {/* Pass Score -> Passing Score */}
              <TableHead>Passing Score</TableHead>

              {/* Attempts -> Attempt Count */}
              <TableHead>Attempt Count</TableHead>

              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((q) => (
              <TableRow key={q.id}>
                {/* CHANGE DATA BINDING AFTER TYPE UPDATE */}
                {/* q.title -> q.quizName */}
                <TableCell className="font-medium">{q.title}</TableCell>

                {/* q.courseName should become q.courseId or show both separately */}
                <TableCell className="text-muted-foreground">{q.courseName}</TableCell>

                {/* q.questionsCount -> q.questionCount */}
                <TableCell className="text-center">{q.questionsCount}</TableCell>

                {/* q.duration -> q.timeLimitMinutes */}
                <TableCell className="text-center">{q.duration} min</TableCell>

                <TableCell className="text-center">{q.passingScore}%</TableCell>

                {/* q.attemptsCount -> q.attemptCount */}
                <TableCell className="text-center">{q.attemptsCount}</TableCell>

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
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            {/* CHANGE DIALOG TITLE */}
            {/* "Edit Quiz" -> "Update Quiz" */}
            {/* "New Quiz" -> "Create Quiz" */}
            <DialogTitle>{editing ? "Update Quiz" : "Create Quiz"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Title -> Quiz Name */}
            <div className="space-y-2">
              <Label>Quiz Name</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>

            <div className="space-y-2">
              <Label>Class</Label>

              <Select
                onValueChange={(value) => {
                  const selected = classList.find((c) => c.id === value);
                  if (selected) {
                    setForm({
                      ...form,
                      courseName: selected.name,
                      courseId: selected.courseId,
                    });
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>

                <SelectContent>
                  {classList.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                {/* Questions -> Question Count */}
                <Label>Question Count</Label>
                <Input type="number" value={form.questionsCount} onChange={(e) => setForm({ ...form, questionsCount: +e.target.value })} />
              </div>

              <div className="space-y-2">
                {/* Duration (min) -> Time Limit (Minutes) */}
                <Label>Time Limit (Minutes)</Label>
                <Input type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: +e.target.value })} />
              </div>

              <div className="space-y-2">
                {/* Pass Score (%) -> Passing Score */}
                <Label>Passing Score</Label>
                <Input type="number" value={form.passingScore} onChange={(e) => setForm({ ...form, passingScore: +e.target.value })} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Question Order</Label>
              <Select
                value={form.questionOrder}
                onValueChange={(v) => setForm({ ...form, questionOrder: v as "SEQUENTIAL" | "RANDOM" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SEQUENTIAL">Sequential</SelectItem>
                  <SelectItem value="RANDOM">Random</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Exam Requirement</Label>
              <Select
                value={form.examRequirement}
                onValueChange={(v) => setForm({ ...form, examRequirement: v as "OPTIONAL" | "MUST_TAKE" | "MUST_PASS" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select requirement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OPTIONAL">Optional</SelectItem>
                  <SelectItem value="MUST_TAKE">Must Take</SelectItem>
                  <SelectItem value="MUST_PASS">Must Pass</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v: string) => setForm({ ...form, status: v as "active" | "inactive" })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {/* CHANGE OPTION VALUES TO BACKEND ENUM STYLE */}
                  <SelectItem value="active">ACTIVE</SelectItem>
                  <SelectItem value="inactive">INACTIVE</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="flex flex-row items-center justify-end gap-2">
            {/* ADD THESE 2 BUTTONS ON SAME LINE AS CANCEL AND SAVE */}      
      
            <Button onClick={() => navigate(`/admin/quizzes/${editing?.id || "new"}/questions`)}>Manage Questions</Button>

            <Button variant="secondary" onClick={() => setDialogOpen(false)}>Cancel</Button>

            {/* CHANGE SAVE TEXT */}
            {/* "Save Changes" -> "Save Quiz" */}
            <Button onClick={handleSave}>{editing ? "Save Quiz" : "Create Quiz"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default QuizzesPage;