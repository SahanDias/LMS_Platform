import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateQuizPage() {
  const navigate = useNavigate();

  const [quizData, setQuizData] = useState({
    name: "",
    classId: "",
    passingScore: "",
    timeLimit: "",
    attemptCount: "",
    questionCount: "",
    questionOrder: "Sequential",
    requirement: "Optional",
  });

  // Mock class list (later fetch from API)
  const classes = [
    { id: 1, name: "Class 1" },
    { id: 2, name: "Class 2" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuizData({ ...quizData, [name]: value });
  };

  const handleSave = () => {
    console.log("Quiz Data:", quizData);
    alert("Quiz Saved (Frontend Only)");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Create Quiz</h1>

      <div>
        <label>Quiz Name:</label><br />
        <input type="text" name="name" value={quizData.name} onChange={handleChange} />
      </div>

      <div>
        <label>Select Class:</label><br />
        <select name="classId" value={quizData.classId} onChange={handleChange}>
          <option value="">-- Select Class --</option>
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Passing Score (%):</label><br />
        <input type="number" name="passingScore" value={quizData.passingScore} min="0" max="100" onChange={handleChange} />
      </div>

      <div>
        <label>Time Limit (minutes):</label><br />
        <input type="number" name="timeLimit" value={quizData.timeLimit} min="1" onChange={handleChange} />
      </div>

      <div>
        <label>Attempt Count:</label><br />
        <input type="number" name="attemptCount" value={quizData.attemptCount} min="1" onChange={handleChange} />
      </div>

      <div>
        <label>Question Count:</label><br />
        <input type="number" name="questionCount" value={quizData.questionCount} min="1" onChange={handleChange} />
      </div>

      <div>
        <label>Question Order:</label><br />
        <input
          type="radio"
          name="questionOrder"
          value="Random"
          onChange={handleChange}
          checked={quizData.questionOrder === "Random"}
        />
        Random

        <input
          type="radio"
          name="questionOrder"
          value="Sequential"
          onChange={handleChange}
          checked={quizData.questionOrder === "Sequential"}
        />
        Sequential
      </div>

      <div>
        <label>Exam Requirement:</label><br />
        <input
          type="radio"
          name="requirement"
          value="Optional"
          onChange={handleChange}
          checked={quizData.requirement === "Optional"}
        />
        Optional

        <input
          type="radio"
          name="requirement"
          value="Must Pass"
          onChange={handleChange}
          checked={quizData.requirement === "Must Pass"}
        />
        Must Pass

        <input
          type="radio"
          name="requirement"
          value="Must Take"
          onChange={handleChange}
          checked={quizData.requirement === "Must Take"}
        />
        Must Take
      </div>

      <br />

      
      <button onClick={() => navigate("/quiz/1/create-question")} style={{ marginLeft: "10px" }}>
        Create Question
      </button>
      <button onClick={() => navigate("/question-bank")} style={{ marginLeft: "10px" }}>
        Select Question
      </button>
      <button onClick={handleSave}>Save Quiz</button>
      <button onClick={() => navigate("/")} style={{ marginLeft: "10px" }}>
        Cancel
      </button>
    </div>
  );
}
