import { useCallback, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  CalendarDays,
  CalendarCheck,
  BookOpen,
  GraduationCap,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  coursesApi,
  classScheduleApi,
  type Course,
  type ClassEntity,
  type ScheduleDTO,
} from "@/services/api";

interface ExpandedSchedule {
  data: ScheduleDTO | null;
  loading: boolean;
}

function formatDate(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatTime(iso: string | null | undefined) {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const StudentCourseClassesPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { toast } = useToast();

  const [course, setCourse] = useState<Course | null>(null);
  const [classes, setClasses] = useState<ClassEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Record<string, ExpandedSchedule>>(
    {}
  );

  const load = useCallback(() => {
    if (!courseId) return;
    setLoading(true);
    Promise.all([
      coursesApi.getById(Number(courseId)),
      classScheduleApi.getOrdered(courseId),
    ])
      .then(([c, cls]) => {
        setCourse(c);
        setClasses(cls);
      })
      .catch(() =>
        toast({ title: "Failed to load classes", variant: "destructive" })
      )
      .finally(() => setLoading(false));
  }, [courseId, toast]);

  useEffect(() => {
    load();
  }, [load]);

  const toggleSchedule = async (classId: string) => {
    if (expanded[classId]) {
      setExpanded((prev) => {
        const copy = { ...prev };
        delete copy[classId];
        return copy;
      });
      return;
    }

    setExpanded((prev) => ({
      ...prev,
      [classId]: { data: null, loading: true },
    }));

    try {
      const data = await classScheduleApi.getSchedule(classId);
      setExpanded((prev) => ({
        ...prev,
        [classId]: { data, loading: false },
      }));
    } catch {
      setExpanded((prev) => ({
        ...prev,
        [classId]: { data: null, loading: false },
      }));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Course header banner */}
      <div className="border-b bg-secondary/30">
        <div className="container mx-auto px-4 py-6">
          <Link
            to="/"
            className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </Link>

          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-96" />
            </div>
          ) : course ? (
            <div className="flex items-start gap-4">
              <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold text-foreground">
                  {course.title}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                  {course.description}
                </p>
              </div>
              <Badge variant="outline" className="shrink-0 mt-1">
                {classes.length} {classes.length === 1 ? "class" : "classes"}
              </Badge>
            </div>
          ) : (
            <h1 className="text-2xl font-bold text-foreground">
              Course Classes
            </h1>
          )}
        </div>
      </div>

      {/* Classes list */}
      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-xl" />
            ))}
          </div>
        ) : classes.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center gap-4 py-20">
              <div className="rounded-full bg-muted p-4">
                <BookOpen className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="text-lg font-medium text-foreground">
                  No classes available yet
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Classes will appear here once they are published and open for
                  enrollment.
                </p>
              </div>
              <Link to="/">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Browse Courses
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {classes.map((c, idx) => {
              const sched = expanded[c.id];
              const isOpen = !!sched;

              return (
                <Card
                  key={c.id}
                  className={`transition-all duration-200 ${
                    isOpen
                      ? "ring-1 ring-primary/20 shadow-md"
                      : "hover:shadow-sm"
                  }`}
                >
                  <CardContent className="p-0">
                    <button
                      onClick={() => toggleSchedule(c.id)}
                      className="flex w-full items-start gap-4 p-5 text-left"
                    >
                      {/* Number circle */}
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                          isOpen
                            ? "bg-primary text-primary-foreground"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        {idx + 1}
                      </span>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-base font-semibold text-foreground">
                            {c.title}
                          </span>
                          <Badge
                            variant="outline"
                            className="border-green-200 bg-green-50 text-green-700 text-[11px]"
                          >
                            {c.status}
                          </Badge>
                          {c.isFree && (
                            <Badge
                              variant="outline"
                              className="border-purple-200 bg-purple-50 text-purple-700 text-[11px]"
                            >
                              Free
                            </Badge>
                          )}
                        </div>
                        {c.description && (
                          <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
                            {c.description}
                          </p>
                        )}

                        {/* Inline schedule preview when collapsed */}
                        {!isOpen && c.scheduleStartAt && (
                          <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                            <CalendarDays className="h-3.5 w-3.5" />
                            <span>
                              {formatDate(c.scheduleStartAt)} —{" "}
                              {formatDate(c.scheduleEndAt)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Chevron */}
                      <div className="shrink-0 mt-1 text-muted-foreground">
                        {isOpen ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </div>
                    </button>

                    {/* Expanded schedule detail */}
                    {isOpen && (
                      <div className="border-t px-5 pb-5 pt-4">
                        {sched.loading ? (
                          <div className="space-y-3">
                            <Skeleton className="h-4 w-56" />
                            <Skeleton className="h-4 w-48" />
                          </div>
                        ) : sched.data ? (
                          <div className="grid gap-3 sm:grid-cols-3">
                            <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
                              <CalendarDays className="mt-0.5 h-4 w-4 text-primary" />
                              <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                  Starts
                                </p>
                                <p className="text-sm font-medium text-foreground">
                                  {formatDate(sched.data.scheduleStartAt)}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {formatTime(sched.data.scheduleStartAt)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
                              <CalendarCheck className="mt-0.5 h-4 w-4 text-primary" />
                              <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                  Ends
                                </p>
                                <p className="text-sm font-medium text-foreground">
                                  {formatDate(sched.data.scheduleEndAt)}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {formatTime(sched.data.scheduleEndAt)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
                              <BookOpen className="mt-0.5 h-4 w-4 text-primary" />
                              <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                  Enrollment
                                </p>
                                <p className="text-sm font-medium">
                                  {sched.data.scheduleOpen ? (
                                    <span className="text-green-600">
                                      Open
                                    </span>
                                  ) : (
                                    <span className="text-red-500">Closed</span>
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No schedule information available.
                          </p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentCourseClassesPage;
