import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { QuizContext } from "../context/QuizContext";

export default function CreateQuestionPage() {
  const navigate = useNavigate();
  const { questionBank, setQuestionBank } = useContext(QuizContext);

  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState("Single");
  const [answers, setAnswers] = useState([
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ]);

  // Handle answer text change
  const handleAnswerChange = (index, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index].text = value;
    setAnswers(updatedAnswers);
  };

  // Handle checkbox change
  const handleCorrectChange = (index) => {
    let updatedAnswers = [...answers];

    if (questionType === "Single") {
      // Only one correct allowed
      updatedAnswers = updatedAnswers.map((ans, i) => ({
        ...ans,
        isCorrect: i === index,
      }));
    } else {
      // Multiple allowed
      updatedAnswers[index].isCorrect = !updatedAnswers[index].isCorrect;
    }

    setAnswers(updatedAnswers);
  };

  const handleSave = () => {
    const newQuestion = {
      id: Date.now(), // Using timestamp for a simple unique ID
      questionText,
      questionType,
      answers,
    };

    setQuestionBank([...questionBank, newQuestion]);

    console.log("Question Saved:", newQuestion);
    alert("Question Saved!");
    navigate(-1); // Go back to the previous page
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Create Question</h1>

      {/* Question Text */}
      <div>
        <label>Question:</label><br />
        <textarea
          rows="4"
          cols="60"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
        />
      </div>

      <br />

      {/* Question Type */}
      <div>
        <label>Question Type:</label><br />

        <input
          type="radio"
          value="Single"
          checked={questionType === "Single"}
          onChange={(e) => setQuestionType(e.target.value)}
        />
        Single Answer

        <input
          type="radio"
          value="Multiple"
          checked={questionType === "Multiple"}
          onChange={(e) => setQuestionType(e.target.value)}
          style={{ marginLeft: "20px" }}
        />
        Multiple Answer
      </div>

      <br />

      {/* Answers Section */}
      <div>
        <label>Answers:</label>

        {answers.map((answer, index) => (
          <div key={index} style={{ marginTop: "10px" }}>
            <input
              type="checkbox"
              checked={answer.isCorrect}
              onChange={() => handleCorrectChange(index)}
            />

            <input
              type="text"
              placeholder={`Answer ${index + 1}`}
              value={answer.text}
              onChange={(e) =>
                handleAnswerChange(index, e.target.value)
              }
              style={{ marginLeft: "10px", width: "300px" }}
            />
          </div>
        ))}
      </div>

      <br />

      {/* Buttons */}
      <button onClick={handleSave}>Save</button>
      <button
        onClick={() => navigate(-1)}
        style={{ marginLeft: "10px" }}
      >
        Cancel
      </button>
    </div>
  );
}
