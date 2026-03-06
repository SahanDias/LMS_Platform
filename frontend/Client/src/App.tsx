import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import MyCourses from "./pages/MyCourses";
import Certificates from "./pages/Certificates";
import CourseDetail from "./pages/CourseDetail";
import NotFound from "./pages/NotFound";
<<<<<<< HEAD
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";
import QuizAttempt from "./pages/QuizAttempt";
=======
import StudentCourseClassesPage from "./pages/StudentCourseClassesPage";
>>>>>>> 594c6592bb5192a3c8e75dc81b071d25bef0bb4f

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/my-courses" element={<MyCourses />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/course/:id" element={<CourseDetail />} />
<<<<<<< HEAD
          <Route path="/success" element={<PaymentSuccess />} />
          <Route path="/failed" element={<PaymentFailed />} />
          <Route path="/quiz-attempt/:quizId" element={<QuizAttempt />} />
=======
          <Route path="/course/:courseId/classes" element={<StudentCourseClassesPage />} />
>>>>>>> 594c6592bb5192a3c8e75dc81b071d25bef0bb4f
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
