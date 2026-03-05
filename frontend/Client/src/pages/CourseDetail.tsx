import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { courses, certificates } from "@/lib/data";
import {
  ArrowLeft,
  Clock,
  BookOpen,
  User,
  Award,
  Play,
  CheckCircle,
  Lock,
} from "lucide-react";

const CourseDetail = () => {
  const { id } = useParams();
  const course = courses.find((c) => c.id === id);
  const certificate = certificates.find((c) => c.courseId === id);

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

  // Generate sample lessons
  const lessons = Array.from({ length: course.lessons }, (_, i) => ({
    id: i + 1,
    title: `Lesson ${i + 1}: ${
      i === 0
        ? "Introduction"
        : i === course.lessons - 1
        ? "Final Project"
        : `Module ${Math.ceil((i + 1) / 5)} - Part ${((i + 1) % 5) || 5}`
    }`,
    duration: `${Math.floor(Math.random() * 20) + 5} min`,
    completed: course.enrolled && (i + 1) / course.lessons <= course.progress / 100,
    locked: !course.enrolled,
  }));

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <div className="relative bg-secondary">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${course.image})` }}
        />
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
                <Badge variant="secondary">{course.category}</Badge>
                <Badge variant="outline" className="border-secondary-foreground/30 text-secondary-foreground">
                  {course.level}
                </Badge>
              </div>

              <h1 className="mb-4 text-3xl font-bold text-secondary-foreground md:text-4xl">
                {course.title}
              </h1>

              <p className="mb-6 text-lg text-secondary-foreground/80">
                {course.description}
              </p>

              <div className="flex flex-wrap items-center gap-6 text-sm text-secondary-foreground/70">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Instructor: {course.instructor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>{course.lessons} lessons</span>
                </div>
              </div>

              {course.enrolled && (
                <div className="mt-6">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-secondary-foreground/80">Your Progress</span>
                    <span className="font-medium text-secondary-foreground">
                      {course.progress}%
                    </span>
                  </div>
                  <Progress value={course.progress} className="h-3" />
                </div>
              )}
            </div>

            <div>
              <Card className="overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="h-48 w-full object-cover"
                />
                <CardContent className="p-6">
                  {course.enrolled ? (
                    course.progress === 100 && certificate ? (
                      <Link to="/certificates">
                        <Button className="w-full gap-2">
                          <Award className="h-4 w-4" />
                          View Certificate
                        </Button>
                      </Link>
                    ) : (
                      <Button className="w-full gap-2">
                        <Play className="h-4 w-4" />
                        Continue Learning
                      </Button>
                    )
                  ) : (
                    <Button className="w-full">Enroll Now - Free</Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <main className="container mx-auto px-4 py-12">
        <h2 className="mb-6 text-2xl font-bold text-foreground">Course Content</h2>

        <div className="space-y-3">
          {lessons.map((lesson) => (
            <Card
              key={lesson.id}
              className={`transition-all ${
                lesson.locked
                  ? "opacity-60"
                  : "cursor-pointer hover:shadow-md"
              }`}
            >
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      lesson.completed
                        ? "bg-primary text-primary-foreground"
                        : lesson.locked
                        ? "bg-muted text-muted-foreground"
                        : "bg-accent text-accent-foreground"
                    }`}
                  >
                    {lesson.completed ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : lesson.locked ? (
                      <Lock className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{lesson.title}</p>
                    <p className="text-sm text-muted-foreground">{lesson.duration}</p>
                  </div>
                </div>
                {!lesson.locked && !lesson.completed && (
                  <Button variant="ghost" size="sm">
                    Start
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default CourseDetail;
