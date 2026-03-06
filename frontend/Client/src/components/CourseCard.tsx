import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type Course } from "@/services/api";
import { Link } from "react-router-dom";

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative overflow-hidden">
        {course.thumbnailImgUrl ? (
          <img
            src={course.thumbnailImgUrl}
            alt={course.title}
            className="h-36 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="h-36 w-full bg-muted flex items-center justify-center text-muted-foreground text-sm">
            No image
          </div>
        )}
        <div className="absolute right-3 top-3">
          <Badge variant={course.status === "ACTIVE" ? "default" : "secondary"}>
            {course.status}
          </Badge>
        </div>
        {course.isFree && (
          <div className="absolute left-3 top-3">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Free
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="mb-1 line-clamp-2 text-base font-semibold text-foreground transition-colors group-hover:text-primary">
          {course.title}
        </h3>
        <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">
          {course.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="font-mono text-xs">{course.courseCode}</span>
          {course.price > 0 && (
            <span className="font-medium text-foreground">${course.price.toFixed(2)}</span>
          )}
        </div>
      </CardContent>

      <CardFooter className="border-t border-border p-4 pt-3">
        <Link to={`/course/${course.id}/classes`} className="w-full">
          <Button className="w-full" size="sm">
            View Classes
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
