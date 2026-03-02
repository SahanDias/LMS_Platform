import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import QuizProvider from "./context/QuizContext";

import CourseQuizDashboard from "./pages/CourseQuizDashboard";
import CreateQuizPage from "./pages/CreateQuizPage";
import CreateQuestionPage from "./pages/CreateQuestionPage";
import QuestionBankPage from "./pages/QuestionBankPage";


function App() {
  return (
    <QuizProvider>
      <Router>
        <Routes>
          <Route path="/" element={<CourseQuizDashboard />} />
          <Route path="/create-quiz" element={<CreateQuizPage />} />
          <Route path="/quiz/:quizId/create-question" element={<CreateQuestionPage />}/>
          <Route path="/question-bank" element={<QuestionBankPage />} />
        </Routes>
      </Router>
    </QuizProvider>  
  );
}

export default App;