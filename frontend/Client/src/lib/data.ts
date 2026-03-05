export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  lessons: number;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  image: string;
  progress: number;
  enrolled: boolean;
}

export interface Certificate {
  id: string;
  courseId: string;
  courseName: string;
  userName: string;
  completedDate: string;
  certificateNumber: string;
}

export const courses: Course[] = [
  {
    id: "1",
    title: "Web Development Fundamentals",
    description: "Learn the basics of HTML, CSS, and JavaScript to build modern websites from scratch.",
    instructor: "Sarah Johnson",
    duration: "8 weeks",
    lessons: 42,
    category: "Development",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop",
    progress: 75,
    enrolled: true,
  },
  {
    id: "2",
    title: "Data Science with Python",
    description: "Master data analysis, visualization, and machine learning using Python and popular libraries.",
    instructor: "Michael Chen",
    duration: "12 weeks",
    lessons: 56,
    category: "Data Science",
    level: "Intermediate",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=250&fit=crop",
    progress: 100,
    enrolled: true,
  },
  {
    id: "3",
    title: "UX/UI Design Masterclass",
    description: "Create beautiful and intuitive user interfaces with industry-standard design principles.",
    instructor: "Emily Roberts",
    duration: "6 weeks",
    lessons: 38,
    category: "Design",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop",
    progress: 30,
    enrolled: true,
  },
  {
    id: "4",
    title: "Cloud Computing Essentials",
    description: "Understand cloud architecture, AWS, and Azure to build scalable applications.",
    instructor: "David Kim",
    duration: "10 weeks",
    lessons: 48,
    category: "Cloud",
    level: "Advanced",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop",
    progress: 0,
    enrolled: false,
  },
  {
    id: "5",
    title: "Mobile App Development",
    description: "Build cross-platform mobile applications using React Native and modern frameworks.",
    instructor: "Jessica Lee",
    duration: "14 weeks",
    lessons: 62,
    category: "Development",
    level: "Intermediate",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop",
    progress: 0,
    enrolled: false,
  },
  {
    id: "6",
    title: "Cybersecurity Fundamentals",
    description: "Learn to protect systems and networks from cyber threats with hands-on security practices.",
    instructor: "Robert Wilson",
    duration: "8 weeks",
    lessons: 44,
    category: "Security",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=250&fit=crop",
    progress: 0,
    enrolled: false,
  },
];

export const certificates: Certificate[] = [
  {
    id: "cert-1",
    courseId: "2",
    courseName: "Data Science with Python",
    userName: "John Doe",
    completedDate: "2024-01-15",
    certificateNumber: "LH-2024-DS-001",
  },
];

export const categories = [
  "All",
  "Development",
  "Data Science",
  "Design",
  "Cloud",
  "Security",
];
