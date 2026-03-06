import { useCallback, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronDown, ChevronUp, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  classScheduleApi,
  type ClassEntity,
  type ScheduleDTO,
} from "@/services/api";

const statusStyles: Record<string, string> = {
  PUBLISHED: "bg-green-50 text-green-700 border-green-200",
  DRAFT: "bg-yellow-50 text-yellow-700 border-yellow-200",
  ARCHIVED: "bg-gray-100 text-gray-600 border-gray-200",
};

interface ExpandedSchedule {
  data: ScheduleDTO | null;
  loading: boolean;
}

function formatDT(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString();
}

const StudentCourseClassesPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { toast } = useToast();

  const [classes, setClasses] = useState<ClassEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Record<string, ExpandedSchedule>>({});

  const load = useCallback(() => {
    if (!courseId) return;
    setLoading(true);
    classScheduleApi
      .getOrdered(courseId)
      .then(setClasses)
      .catch(() => toast({ title: "Failed to load classes", variant: "destructive" }))
      .finally(() => setLoading(false));
  }, [courseId, toast]);

  useEffect(() => { load(); }, [load]);

  const toggleSchedule = async (classId: string) => {
    if (expanded[classId]) {
      setExpanded((prev) => {
        const copy = { ...prev };
        delete copy[classId];
        return copy;
      });
      return;
    }

    setExpanded((prev) => ({ ...prev, [classId]: { data: null, loading: true } }));

    try {
      const data = await classScheduleApi.getSchedule(classId);
      setExpanded((prev) => ({ ...prev, [classId]: { data, loading: false } }));
    } catch {
      setExpanded((prev) => ({ ...prev, [classId]: { data: null, loading: false } }));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Courses
        </Link>

        <h1 className="text-2xl font-bold mb-6">Course Classes</h1>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        ) : classes.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
              <p>No classes available for this course yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {classes.map((c, idx) => {
              const sched = expanded[c.id];
              const isOpen = !!sched;

              return (
                <Card key={c.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {idx + 1}
                      </span>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium">{c.title}</span>
                          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${statusStyles[c.status] || ""}`}>
                            {c.status}
                          </span>
                          {c.isFree && (
                            <span className="inline-flex items-center rounded-full border border-purple-200 bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-700">Free</span>
                          )}
                        </div>
                        {c.description && (
                          <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
                        )}

                        {/* Expanded schedule */}
                        {isOpen && (
                          <div className="mt-3 rounded-lg bg-muted p-3 text-sm">
                            {sched.loading ? (
                              <div className="space-y-2">
                                <Skeleton className="h-4 w-48" />
                                <Skeleton className="h-4 w-40" />
                              </div>
                            ) : sched.data ? (
                              <div className="space-y-1 text-muted-foreground">
                                <p>
                                  <Clock className="mr-1 inline h-3.5 w-3.5" />
                                  Start: {formatDT(sched.data.scheduleStartAt)}
                                </p>
                                <p>
                                  <Clock className="mr-1 inline h-3.5 w-3.5" />
                                  End: {formatDT(sched.data.scheduleEndAt)}
                                </p>
                                <p>
                                  Open:{" "}
                                  {sched.data.scheduleOpen ? (
                                    <span className="text-green-600 font-medium">Yes</span>
                                  ) : (
                                    <span className="text-muted-foreground">No</span>
                                  )}
                                </p>
                              </div>
                            ) : (
                              <p className="text-muted-foreground">No schedule set</p>
                            )}
                          </div>
                        )}
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleSchedule(c.id)}
                        title="Toggle schedule"
                      >
                        {isOpen ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentCourseClassesPage;
