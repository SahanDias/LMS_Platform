import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type Answer = {
  id: string;
  answerText: string;
};

type Question = {
  id: string;
  questionText: string;
  questionType: "SINGLE" | "MULTIPLE";
  answers: Answer[];
};

const mockQuiz = {
  id: "quiz-1",
  quizName: "Java Basics Quiz",
  courseName: "Java Programming",
  className: "Y2S1 Group A",
  timeLimitMinutes: 30,
  questions: [
    {
      id: "q1",
      questionText: "Which of the following is a Java keyword?",
      questionType: "SINGLE" as const,
      answers: [
        { id: "a1", answerText: "class" },
        { id: "a2", answerText: "define" },
        { id: "a3", answerText: "function" },
        { id: "a4", answerText: "include" },
      ],
    },
    {
      id: "q2",
      questionText: "Select object-oriented programming concepts.",
      questionType: "MULTIPLE" as const,
      answers: [
        { id: "a5", answerText: "Encapsulation" },
        { id: "a6", answerText: "Inheritance" },
        { id: "a7", answerText: "Compilation" },
        { id: "a8", answerText: "Polymorphism" },
      ],
    },
  ],
};

export default function QuizAttempt() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const quiz = mockQuiz;

  const [resultOpen, setResultOpen] = useState(false);
  const [singleAnswers, setSingleAnswers] = useState<Record<string, string>>({});
  const [multipleAnswers, setMultipleAnswers] = useState<Record<string, string[]>>({});

  const totalQuestions = quiz.questions.length;

  const answeredCount = useMemo(() => {
    return quiz.questions.filter((q) => {
      if (q.questionType === "SINGLE") {
        return !!singleAnswers[q.id];
      }
      return (multipleAnswers[q.id] || []).length > 0;
    }).length;
  }, [quiz.questions, singleAnswers, multipleAnswers]);

  const handleSingleChange = (questionId: string, answerId: string) => {
    setSingleAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }));
  };

  const handleMultipleChange = (questionId: string, answerId: string) => {
    setMultipleAnswers((prev) => {
      const current = prev[questionId] || [];
      const updated = current.includes(answerId)
        ? current.filter((id) => id !== answerId)
        : [...current, answerId];

      return {
        ...prev,
        [questionId]: updated,
      };
    });
  };

  const handleSubmit = () => {
    const payload = {
      quizId: quizId,
      answers: quiz.questions.map((question) => ({
        questionId: question.id,
        selectedAnswerIds:
          question.questionType === "SINGLE"
            ? singleAnswers[question.id]
              ? [singleAnswers[question.id]]
              : []
            : multipleAnswers[question.id] || [],
      })),
    };

    console.log("Submit payload:", payload);
    setResultOpen(true);
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="border rounded-xl bg-card p-6 shadow-sm">
          <h1 className="text-2xl font-bold">{quiz.quizName}</h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 text-sm">
            <div>
              <p className="text-muted-foreground">Course Name</p>
              <p className="font-medium">{quiz.courseName}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Class Name</p>
              <p className="font-medium">{quiz.className}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Time Limit</p>
              <p className="font-medium">{quiz.timeLimitMinutes} min</p>
            </div>
            <div>
              <p className="text-muted-foreground">Answered</p>
              <p className="font-medium">
                {answeredCount} / {totalQuestions}
              </p>
            </div>
          </div>
        </div>

        {quiz.questions.map((question, index) => (
          <div key={question.id} className="border rounded-xl bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-2">
              Question {index + 1}
            </h2>
            <p className="mb-4">{question.questionText}</p>

            <div className="space-y-3">
              {question.answers.map((answer) => (
                <label
                  key={answer.id}
                  className="flex items-start gap-3 border rounded-lg p-3 cursor-pointer"
                >
                  {question.questionType === "SINGLE" ? (
                    <input
                      type="radio"
                      name={question.id}
                      checked={singleAnswers[question.id] === answer.id}
                      onChange={() => handleSingleChange(question.id, answer.id)}
                      className="mt-1"
                    />
                  ) : (
                    <input
                      type="checkbox"
                      checked={(multipleAnswers[question.id] || []).includes(answer.id)}
                      onChange={() => handleMultipleChange(question.id, answer.id)}
                      className="mt-1"
                    />
                  )}

                  <span>{answer.answerText}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Submit Quiz</Button>
        </div>
      </div>

      <Dialog open={resultOpen} onOpenChange={setResultOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Quiz Result</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Total Questions</span>
              <span className="font-medium">{totalQuestions}</span>
            </div>
            <div className="flex justify-between">
              <span>Answered Questions</span>
              <span className="font-medium">{answeredCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Status</span>
              <span className="font-medium">Submitted</span>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={() => {
                setResultOpen(false);
                navigate(-1);
              }}
            >
              Back to Class
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}