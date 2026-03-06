export interface Course {
  id: number;
  courseCode: string;
  title: string;
  description: string;
  thumbnailImgUrl: string;
  price: number;
  passingPercentage: number;
  certificationEnabled: boolean;
  isFree: boolean;
  status: "ACTIVE" | "INACTIVE";
  createdBy: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Video {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  courseId: number;
  duration: number; // in minutes
  isFreePreview: boolean;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}

export interface Certification {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  issuedTo: string;
  issuedAt: string;
  expiresAt: string | null;
  status: "active" | "expired" | "revoked";
}

export interface Quiz {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  questionsCount: number;
  duration: number;
  passingScore: number;
  status: "active" | "inactive";
  attemptsCount: number;
}

export interface Payment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  courseId: string;
  courseName: string;
  amount: number;
  currency: string;
  status: "SUCCESS" | "pending" | "FAILED" | "refunded";
  stripePaymentId: string;
  method: string;
  createdAt: string;
}
