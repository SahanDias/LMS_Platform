import type { Course } from "@/lib/data";

type BackendCourseDTO = {
  id: number;
  courseCode?: string;
  title?: string;
  description?: string;
  thumbnailImgUrl?: string;
  price?: number | string;
  passingPercentage?: number;
  certificationEnabled?: boolean;
  status?: string;
  createdBy?: number;
  createdAt?: string;
  updatedAt?: string;
  free?: boolean;
  isFree?: boolean;
};

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop";

const API_BASE = "http://localhost:7878/api/v1/course";

const toUiLevel = (passingPercentage?: number): Course["level"] => {
  if (passingPercentage === undefined || passingPercentage === null) {
    return "Beginner";
  }
  if (passingPercentage >= 80) {
    return "Advanced";
  }
  if (passingPercentage >= 60) {
    return "Intermediate";
  }
  return "Beginner";
};

const toUiCourse = (course: BackendCourseDTO): Course => {
  const parsedPrice = Number(course.price);
  const hasValidPrice = Number.isFinite(parsedPrice) && parsedPrice >= 0;
  const price = hasValidPrice ? parsedPrice : 0;
  const isFree = Boolean(course.isFree ?? course.free ?? false) || price <= 0;

  return {
    id: String(course.id),
    title: course.title || "Untitled Course",
    description: course.description || "No description available.",
    instructor: "LMS Instructor",
    duration: "Self-paced",
    lessons: 12,
    price,
    category: isFree ? "Free" : "Paid",
    level: toUiLevel(course.passingPercentage),
    image: course.thumbnailImgUrl || DEFAULT_IMAGE,
    progress: 0,
    enrolled: false,
  };
};

const parseError = async (res: Response, fallback: string) => {
  const text = await res.text();
  return text || fallback;
};

export const courseApi = {
  async getAllCourses(): Promise<Course[]> {
    const res = await fetch(API_BASE);
    if (!res.ok) {
      throw new Error(await parseError(res, "Failed to fetch courses"));
    }
    const payload = (await res.json()) as
      | BackendCourseDTO[]
      | { data?: BackendCourseDTO[]; content?: BackendCourseDTO[] };

    const list = Array.isArray(payload)
      ? payload
      : Array.isArray(payload.data)
      ? payload.data
      : Array.isArray(payload.content)
      ? payload.content
      : [];

    return list.map(toUiCourse);
  },

  async getCourseById(id: string | number): Promise<Course> {
    const res = await fetch(`${API_BASE}/getCourse/${id}`);
    if (!res.ok) {
      throw new Error(await parseError(res, "Failed to fetch course"));
    }
    const payload = (await res.json()) as BackendCourseDTO;
    return toUiCourse(payload);
  },

  async createCourse(data: BackendCourseDTO): Promise<BackendCourseDTO> {
    const res = await fetch(`${API_BASE}/createCourse`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      throw new Error(await parseError(res, "Failed to create course"));
    }
    return res.json();
  },

  async updateCourse(
    id: string | number,
    data: Partial<BackendCourseDTO>
  ): Promise<BackendCourseDTO> {
    const res = await fetch(`${API_BASE}/updateCourse/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      throw new Error(await parseError(res, "Failed to update course"));
    }
    return res.json();
  },

  async deleteCourse(id: string | number): Promise<void> {
    const res = await fetch(`${API_BASE}/deleteCourse/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error(await parseError(res, "Failed to delete course"));
    }
  },
};
