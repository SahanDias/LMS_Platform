import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CourseQuizDashboard() {
  const navigate = useNavigate();

  // Store quizzes in state
  const [quizzes, setQuizzes] = useState([
    {
      id: 1,
      name: "Java Basics Quiz",
      className: "Class 1",
      passingScore: "60%",
      timeLimit: "30 mins",
      status: "Active",
    },
  ]);

  // Toggle status function
  const toggleStatus = (id) => {
    const updatedQuizzes = quizzes.map((quiz) =>
      quiz.id === id
        ? {
            ...quiz,
            status: quiz.status === "Active" ? "Inactive" : "Active",
          }
        : quiz
    );

    setQuizzes(updatedQuizzes);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Course Quiz Dashboard</h1>

      <button
        style={{ float: "right", marginBottom: "20px" }}
        onClick={() => navigate("/create-quiz")}
      >
        Create New Quiz
      </button>

      <table border="1" width="100%" cellPadding="10">
        <thead>
          <tr>
            <th>Quiz Name</th>
            <th>Class Name</th>
            <th>Passing Score</th>
            <th>Time Limit</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {quizzes.map((quiz) => (
            <tr key={quiz.id}>
              <td>{quiz.name}</td>
              <td>{quiz.className}</td>
              <td>{quiz.passingScore}</td>
              <td>{quiz.timeLimit}</td>

              <td>
                <button onClick={() => toggleStatus(quiz.id)}>
                  {quiz.status}
                </button>
              </td>

              <td>
                <button>Edit</button>
                <button style={{ marginLeft: "10px" }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
