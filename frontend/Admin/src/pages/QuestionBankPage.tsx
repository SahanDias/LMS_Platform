import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Search, ArrowLeft, Trash2, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

interface QuestionOption {
  id: string;
  text: string;
}

type QuestionType = "SINGLE" | "MULTIPLE";

interface QuestionItem {
  id: string;
  quizId?: string;
  courseId: string;
  classId: string;
  questionText: string;
  questionType: QuestionType;
  options: QuestionOption[];
  correctAnswer: string;
}

type QuestionForm = {
  questionText: string;
  questionType: QuestionType;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
};

const emptyForm: QuestionForm = {
  questionText: "",
  questionType: "SINGLE",
  optionA: "",
  optionB: "",
  optionC: "",
  optionD: "",
  correctAnswer: "A",
};

const initialQuestions: QuestionItem[] = [
  {
    id: "qst1",
    quizId: "q1",
    courseId: "C1",
    classId: "1",
    questionText: "What is React primarily used for?",
    questionType: "SINGLE",
    options: [
      { id: "A", text: "Building user interfaces" },
      { id: "B", text: "Managing databases" },
      { id: "C", text: "Server monitoring" },
      { id: "D", text: "Network security" },
    ],
    correctAnswer: "A",
  },
  {
    id: "qst2",
    quizId: "q1",
    courseId: "C1",
    classId: "1",
    questionText: "Which hook is used to manage state in a function component?",
    questionType: "SINGLE",
    options: [
      { id: "A", text: "useFetch" },
      { id: "B", text: "useState" },
      { id: "C", text: "useRoute" },
      { id: "D", text: "useNode" },
    ],
    correctAnswer: "B",
  },
  {
    id: "qst3",
    quizId: "q2",
    courseId: "C2",
    classId: "2",
    questionText: "Python is a statically typed language.",
    questionType: "SINGLE",
    options: [
      { id: "A", text: "True" },
      { id: "B", text: "False" },
    ],
    correctAnswer: "B",
  },
  {
    id: "qst4",
    courseId: "C1",
    classId: "1",
    questionText: "What does JSX stand for?",
    questionType: "SINGLE",
    options: [],
    correctAnswer: "JavaScript XML",
  },
];

export default function QuestionBankPage() {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const { toast } = useToast();

  const [questions, setQuestions] = useState<QuestionItem[]>(initialQuestions);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<QuestionItem | null>(null);
  const [form, setForm] = useState<QuestionForm>(emptyForm);

  // temporary values - later replace with real quiz/class data
  const currentCourseId = "C1";
  const currentClassId = "1";
  const currentQuizName = "Java Basics Quiz";
  const currentCourseName = "Java Programming";
  const currentClassName = "Y2S1 Group A";

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchesClass = q.courseId === currentCourseId && q.classId === currentClassId;
      const matchesSearch =
        q.questionText.toLowerCase().includes(search.toLowerCase()) ||
        q.questionType.toLowerCase().includes(search.toLowerCase());

      return matchesClass && matchesSearch;
    });
  }, [questions, search]);

  const selectedQuestions = filteredQuestions.filter((q) =>
    selectedIds.includes(q.id)
    );

    const unselectedQuestions = filteredQuestions.filter((q) =>
    !selectedIds.includes(q.id)
    );

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (question: QuestionItem) => {
    setEditing(question);

    setForm({
      questionText: question.questionText,
      questionType: question.questionType,
      optionA: question.options.find((o) => o.id === "A")?.text ?? "",
      optionB: question.options.find((o) => o.id === "B")?.text ?? "",
      optionC: question.options.find((o) => o.id === "C")?.text ?? "",
      optionD: question.options.find((o) => o.id === "D")?.text ?? "",
      correctAnswer: question.correctAnswer,
    });

    setDialogOpen(true);
  };

  const handleSaveQuestion = () => {
// both SINGLE and MULTIPLE use the same option-building logic
      const builtOptions = [
            { id: "A", text: form.optionA },
            { id: "B", text: form.optionB },
            { id: "C", text: form.optionC },
            { id: "D", text: form.optionD },
          ].filter((opt) => opt.text.trim() !== "");

    if (editing) {
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === editing.id
            ? {
                ...q,
                questionText: form.questionText,
                questionType: form.questionType,
                options: builtOptions,
                correctAnswer: form.correctAnswer,
              }
            : q
        )
      );

      toast({ title: "Question updated" });
    } else {
      const newQuestion: QuestionItem = {
        id: `qst${Date.now()}`,
        quizId,
        courseId: currentCourseId,
        classId: currentClassId,
        questionText: form.questionText,
        questionType: form.questionType,
        options: builtOptions,
        correctAnswer: form.correctAnswer,
      };

      setQuestions((prev) => [newQuestion, ...prev]);
      toast({ title: "Question created" });
    }

    setDialogOpen(false);
    setForm(emptyForm);
    setEditing(null);
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    setSelectedIds((prev) => prev.filter((item) => item !== id));
    toast({ title: "Question deleted" });
  };

  const toggleQuestionSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSaveSelected = () => {
    toast({
      title: "Questions selected",
      description: `${selectedIds.length} question(s) selected for this quiz`,
    });

    navigate("/admin/quizzes");
  };

  const handleClearSelected = () => {
    setSelectedIds([]);
    toast({ title: "Selection cleared" });
  };

  const isAllSelected =
    filteredQuestions.length > 0 &&
    filteredQuestions.every((question) => selectedIds.includes(question.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !filteredQuestions.some((question) => question.id === id))
      );
    } else {
      const allIds = filteredQuestions.map((question) => question.id);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...allIds])));
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Question Bank</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and select questions for the quiz
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => navigate("/admin/quizzes")}>
            Back to Quiz
          </Button>
          <Button onClick={openCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Create Question
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="border rounded-xl bg-card p-4">
            <p className="text-sm text-muted-foreground">Quiz Name</p>
            <p className="font-semibold mt-1">{currentQuizName}</p>
        </div>

        <div className="border rounded-xl bg-card p-4">
            <p className="text-sm text-muted-foreground">Course Name</p>
            <p className="font-semibold mt-1">{currentCourseName}</p>
        </div>

        <div className="border rounded-xl bg-card p-4">
            <p className="text-sm text-muted-foreground">Class Name</p>
            <p className="font-semibold mt-1">{currentClassName}</p>
        </div>
        </div>

      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search questions..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-6">
  <div>
    <h2 className="text-lg font-semibold mb-3">Selected Questions</h2>
    <div className="border rounded-xl overflow-hidden bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px] text-center">Select</TableHead>
            <TableHead>Question</TableHead>
            <TableHead className="text-center">Question Type</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {selectedQuestions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                No selected questions
              </TableCell>
            </TableRow>
          ) : (
            selectedQuestions.map((question) => (
              <TableRow key={question.id}>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <Checkbox
                      checked={selectedIds.includes(question.id)}
                      onCheckedChange={() => toggleQuestionSelection(question.id)}
                    />
                  </div>
                </TableCell>

                <TableCell className="font-medium max-w-[420px]">
                  <div className="truncate">{question.questionText}</div>
                </TableCell>

                <TableCell className="text-center">{question.questionType}</TableCell>

                <TableCell className="text-right space-x-1">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(question)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteQuestion(question.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  </div>

  <div>
    <h2 className="text-lg font-semibold mb-3">Available Questions</h2>
    <div className="border rounded-xl overflow-hidden bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px] text-center">
              <div className="flex justify-center">
                <Checkbox checked={isAllSelected} onCheckedChange={toggleSelectAll} />
              </div>
            </TableHead>
            <TableHead>Question</TableHead>
            <TableHead className="text-center">Question Type</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {unselectedQuestions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                No available questions
              </TableCell>
            </TableRow>
          ) : (
            unselectedQuestions.map((question) => (
              <TableRow key={question.id}>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <Checkbox
                      checked={selectedIds.includes(question.id)}
                      onCheckedChange={() => toggleQuestionSelection(question.id)}
                    />
                  </div>
                </TableCell>

                <TableCell className="font-medium max-w-[420px]">
                  <div className="truncate">{question.questionText}</div>
                </TableCell>

                <TableCell className="text-center">{question.questionType}</TableCell>

                <TableCell className="text-right space-x-1">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(question)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteQuestion(question.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  </div>
</div>

      <div className="flex items-center justify-end gap-2 mt-6">
        <Button variant="secondary" onClick={() => navigate("/admin/quizzes")}>
          Cancel
        </Button>
        <Button onClick={handleSaveSelected}>Save Selected Questions</Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
    <DialogContent className="max-w-4xl">
        <DialogHeader>
        <DialogTitle>{editing ? "Update Question" : "Create Question"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
        <div className="space-y-2">
            <Label>Question Text</Label>
            <Textarea
            className="min-h-[120px]"
            value={form.questionText}
            onChange={(e) => setForm({ ...form, questionText: e.target.value })}
            placeholder="Enter question"
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
            <Label>Question Type</Label>
            <Select
                value={form.questionType}
                onValueChange={(value: QuestionType) =>
                setForm({ ...form, questionType: value })
                }
            >
                <SelectTrigger>
                <SelectValue />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="SINGLE">Single choice</SelectItem>
                <SelectItem value="MULTIPLE">Multiple choice</SelectItem>
                </SelectContent>
            </Select>
            </div>

            <div className="space-y-2">
            <Label>Correct Answer</Label>
            <Select
                value={form.correctAnswer}
                onValueChange={(value) => setForm({ ...form, correctAnswer: value })}
            >
                <SelectTrigger>
                <SelectValue placeholder="Select correct answer" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="A">Option A</SelectItem>
                <SelectItem value="B">Option B</SelectItem>
                <SelectItem value="C">Option C</SelectItem>
                <SelectItem value="D">Option D</SelectItem>
                </SelectContent>
            </Select>
            </div>
        </div>

        {(form.questionType === "SINGLE" || form.questionType === "MULTIPLE") && (
            <div className="space-y-4">
            <div className="space-y-2">
                <Label>Option A</Label>
                <Input
                value={form.optionA}
                onChange={(e) => setForm({ ...form, optionA: e.target.value })}
                />
            </div>

            <div className="space-y-2">
                <Label>Option B</Label>
                <Input
                value={form.optionB}
                onChange={(e) => setForm({ ...form, optionB: e.target.value })}
                />
            </div>

            <div className="space-y-2">
                <Label>Option C</Label>
                <Input
                value={form.optionC}
                onChange={(e) => setForm({ ...form, optionC: e.target.value })}
                />
            </div>

            <div className="space-y-2">
                <Label>Option D</Label>
                <Input
                value={form.optionD}
                onChange={(e) => setForm({ ...form, optionD: e.target.value })}
                />
            </div>
            </div>
        )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClearSelected}>
            Clear Selected
          </Button>
          <Button  onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveQuestion}>
            {editing ? "Save Question" : "Create Question"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </AdminLayout>
  );
}