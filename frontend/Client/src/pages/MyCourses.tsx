import { useEffect, useState } from "react";
import Header from "@/components/Header";
import CourseCard from "@/components/CourseCard";
import { type Course } from "@/lib/data";
import { BookOpen } from "lucide-react";
import { courseApi } from "@/services/courseApi";
import { Button } from "@/components/ui/button";

const MyCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const fetchCourses = async () => {
    setIsLoadingCourses(true);
    setLoadError(null);
    try {
      const data = await courseApi.getAllCourses();
      setCourses(data);
    } catch (error) {
      setLoadError(
        error instanceof Error ? error.message : "Unable to load courses"
      );
      setCourses([]);
    } finally {
      setIsLoadingCourses(false);
    }
  };

  useEffect(() => {
    void fetchCourses();
  }, []);

  const enrolledCourses = courses.filter((course) => course.enrolled);
  const inProgressCourses = enrolledCourses.filter(
    (course) => course.progress > 0 && course.progress < 100
  );
  const completedCourses = enrolledCourses.filter(
    (course) => course.progress === 100
  );
  const notStartedCourses = enrolledCourses.filter(
    (course) => course.progress === 0
  );

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

        {isLoadingCourses ? (
          <div className="flex items-center justify-center py-16 text-center">
            <p className="text-muted-foreground">Loading courses...</p>
          </div>
        ) : loadError ? (
          <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <p className="font-medium text-foreground">Failed to load courses</p>
            <p className="text-muted-foreground">{loadError}</p>
            <Button onClick={() => void fetchCourses()}>Retry</Button>
          </div>
        ) : enrolledCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <BookOpen className="mb-4 h-16 w-16 text-muted-foreground" />
            <p className="text-lg font-medium text-foreground">
              No enrolled courses yet
            </p>
            <p className="text-muted-foreground">
              Start learning by enrolling in a course
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {inProgressCourses.length > 0 && (
              <section>
                <h2 className="mb-4 text-xl font-semibold text-foreground">
                  In Progress ({inProgressCourses.length})
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {inProgressCourses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              </section>
            )}

            {completedCourses.length > 0 && (
              <section>
                <h2 className="mb-4 text-xl font-semibold text-foreground">
                  Completed ({completedCourses.length})
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {completedCourses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              </section>
            )}

            {notStartedCourses.length > 0 && (
              <section>
                <h2 className="mb-4 text-xl font-semibold text-foreground">
                  Not Started ({notStartedCourses.length})
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {notStartedCourses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyCourses;
