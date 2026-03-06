import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import CoursesPage from "./pages/CoursesPage";
import CertificationsPage from "./pages/CertificationsPage";
import QuizzesPage from "./pages/QuizzesPage";
import PaymentsPage from "./pages/PaymentsPage";
import NotFound from "./pages/NotFound";
import QuestionBankPage from "./pages/QuestionBankPage";
import AdminClassesPage from "./pages/AdminClassesPage";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/courses" element={<ProtectedRoute><CoursesPage /></ProtectedRoute>} />
            <Route path="/certifications" element={<ProtectedRoute><CertificationsPage /></ProtectedRoute>} />
            <Route path="/quizzes" element={<ProtectedRoute><QuizzesPage /></ProtectedRoute>} />
            <Route path="/payments" element={<ProtectedRoute><PaymentsPage /></ProtectedRoute>} />
            <Route path="/class-schedule" element={<ProtectedRoute><AdminClassesPage /></ProtectedRoute>} />
            <Route path="/courses/:courseId/classes" element={<ProtectedRoute><AdminClassesPage /></ProtectedRoute>} />
            <Route path="/admin/quizzes/:quizId/questions" element={<ProtectedRoute><QuestionBankPage /></ProtectedRoute>} />
            <Route path="/admin/quizzes" element={<QuizzesPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;