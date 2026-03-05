import { Clock, BookOpen, User } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Course } from "@/lib/data";
import { Link } from "react-router-dom";

interface CourseCardProps {
  course: Course;
}

const levelColors = {
  Beginner: "bg-chart-1/20 text-chart-1 border-chart-1/30",
  Intermediate: "bg-chart-2/20 text-chart-2 border-chart-2/30",
  Advanced: "bg-destructive/20 text-destructive border-destructive/30",
};

const CourseCard = ({ course }: CourseCardProps) => {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative overflow-hidden">
        <img
          src={course.image}
          alt={course.title}
          className="h-36 w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3">
          <Badge variant="outline" className={levelColors[course.level]}>
            {course.level}
          </Badge>
        </div>
        <div className="absolute right-3 top-3">
          <Badge variant="secondary">{course.category}</Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="mb-1 line-clamp-2 text-base font-semibold text-foreground transition-colors group-hover:text-primary">
          {course.title}
        </h3>
        <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">
          {course.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{course.instructor}</span>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span>{course.lessons} lessons</span>
          </div>
        </div>

        {course.enrolled && (
          <div className="mt-4">
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-foreground">{course.progress}%</span>
            </div>
            <Progress value={course.progress} className="h-2" />
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t border-border p-4 pt-3">
        <Link to={`/course/${course.id}`} className="w-full">
          <Button className="w-full" size="sm" variant={course.enrolled ? "secondary" : "default"}>
            {course.enrolled
              ? course.progress === 100
                ? "View Certificate"
                : "Continue Learning"
              : "Enroll Now"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
