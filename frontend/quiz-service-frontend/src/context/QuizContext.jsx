import { createContext, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const QuizContext = createContext(null);

export default function QuizProvider({ children }) {
  const [questionBank, setQuestionBank] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  return (
    <QuizContext.Provider
      value={{
        questionBank,
        setQuestionBank,
        selectedQuestions,
        setSelectedQuestions,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}
