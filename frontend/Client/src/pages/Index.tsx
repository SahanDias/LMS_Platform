import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CourseCard from "@/components/CourseCard";
import CourseFilters from "@/components/CourseFilters";
import { type Course } from "@/lib/data";
import { courseApi } from "@/services/courseApi";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

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

  const categories = useMemo(() => {
    const uniqueCategories = new Set(courses.map((course) => course.category));
    return ["All", ...Array.from(uniqueCategories)];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || course.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [courses, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />

      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="mb-2 text-3xl font-bold text-foreground">
            Explore Our Courses
          </h2>
          <p className="text-muted-foreground">
            Discover courses taught by industry experts
          </p>
        </div>

        <CourseFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
        />

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
        ) : filteredCourses.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-lg font-medium text-foreground">No courses found</p>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </main>

      <footer className="border-t border-border bg-card py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 LearnHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
