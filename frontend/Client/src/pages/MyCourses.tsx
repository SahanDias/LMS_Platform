import { useEffect, useState } from "react";
import Header from "@/components/Header";
import CourseCard from "@/components/CourseCard";
import { coursesApi, type Course } from "@/services/api";
import { BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const MyCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    coursesApi
      .getAll()
      .then(setCourses)
      .catch(() => toast({ title: "Failed to load courses", variant: "destructive" }))
      .finally(() => setLoading(false));
  }, [toast]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">My Learning</h1>
          <p className="text-muted-foreground">
            Track your progress and continue where you left off
          </p>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-72 w-full rounded-lg" />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <BookOpen className="mb-4 h-16 w-16 text-muted-foreground" />
            <p className="text-lg font-medium text-foreground">
              No courses yet
            </p>
            <p className="text-muted-foreground">
              Explore courses and start learning
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyCourses;
