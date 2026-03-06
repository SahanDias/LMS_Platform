import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { coursesApi, classScheduleApi, type Course, type ClassEntity } from "@/services/api";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const CourseDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [course, setCourse] = useState<Course | null>(null);
  const [classes, setClasses] = useState<ClassEntity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      coursesApi.getById(Number(id)),
      classScheduleApi.getOrdered(id),
    ])
      .then(([c, cls]) => {
        setCourse(c);
        setClasses(cls);
      })
      .catch(() => toast({ title: "Failed to load course", variant: "destructive" }))
      .finally(() => setLoading(false));
  }, [id, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 space-y-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto flex flex-col items-center justify-center px-4 py-16">
          <h1 className="text-2xl font-bold text-foreground">Course not found</h1>
          <Link to="/" className="mt-4">
            <Button>Back to Courses</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <div className="relative bg-secondary">
        {course.thumbnailImgUrl && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url(${course.thumbnailImgUrl})` }}
          />
        )}
        <div className="container relative mx-auto px-4 py-12">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 text-sm text-secondary-foreground/80 hover:text-secondary-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </Link>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="mb-4 flex flex-wrap gap-2">
                <Badge variant={course.status === "ACTIVE" ? "default" : "secondary"}>
                  {course.status}
                </Badge>
                {course.isFree && (
                  <Badge variant="outline" className="border-green-200 text-green-700">
                    Free
                  </Badge>
                )}
              </div>

              <h1 className="mb-4 text-3xl font-bold text-secondary-foreground md:text-4xl">
                {course.title}
              </h1>

              <p className="mb-6 text-lg text-secondary-foreground/80">
                {course.description}
              </p>

              <div className="flex flex-wrap items-center gap-6 text-sm text-secondary-foreground/70">
                <span className="font-mono">{course.courseCode}</span>
                {course.price > 0 && <span>Price: ${course.price.toFixed(2)}</span>}
              </div>
            </div>

            <div>
              <Card className="overflow-hidden">
                {course.thumbnailImgUrl ? (
                  <img
                    src={course.thumbnailImgUrl}
                    alt={course.title}
                    className="h-48 w-full object-cover"
                  />
                ) : (
                  <div className="h-48 w-full bg-muted flex items-center justify-center text-muted-foreground">
                    No image
                  </div>
                )}
                <CardContent className="p-6">
                  <Link to={`/course/${course.id}/classes`}>
                    <Button className="w-full gap-2">
                      <BookOpen className="h-4 w-4" />
                      View Classes
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Classes List */}
      <main className="container mx-auto px-4 py-12">
        <h2 className="mb-6 text-2xl font-bold text-foreground">
          Classes ({classes.length})
        </h2>

        {classes.length === 0 ? (
          <p className="text-muted-foreground">No classes available for this course yet.</p>
        ) : (
          <div className="space-y-3">
            {classes.map((cls, idx) => (
              <Card key={cls.id}>
                <CardContent className="flex items-center gap-4 p-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{cls.title}</p>
                    {cls.description && (
                      <p className="text-sm text-muted-foreground truncate">{cls.description}</p>
                    )}
                  </div>
                  <Badge variant={cls.status === "PUBLISHED" ? "default" : "secondary"}>
                    {cls.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CourseDetail;
