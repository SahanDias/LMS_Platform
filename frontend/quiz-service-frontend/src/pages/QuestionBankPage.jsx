import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QuizContext } from "../context/QuizContext";

export default function QuestionBankPage() {
  const { questionBank, setSelectedQuestions } =
    useContext(QuizContext);

  const navigate = useNavigate();
  const [tempSelected, setTempSelected] = useState([]);

  const handleSelect = (id) => {
    if (tempSelected.includes(id)) {
      setTempSelected(tempSelected.filter((q) => q !== id));
    } else {
      setTempSelected([...tempSelected, id]);
    }
  };

  const handleSave = () => {
    const selected = questionBank.filter((q) =>
      tempSelected.includes(q.id)
    );

    setSelectedQuestions(selected);
    navigate(-1);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Question Bank</h1>

      {questionBank.length === 0 ? (
        <p>No questions available.</p>
      ) : (
        questionBank.map((question) => (
          <div key={question.id} style={{ marginBottom: "15px" }}>
            <input
              type="checkbox"
              checked={tempSelected.includes(question.id)}
              onChange={() => handleSelect(question.id)}
            />

            <strong style={{ marginLeft: "10px" }}>
              {question.questionText}
            </strong>
          </div>
        ))
      )}

      <br />

      <button onClick={handleSave}>Save Selected</button>
      <button
        onClick={() => navigate(-1)}
        style={{ marginLeft: "10px" }}
      >
        Cancel
      </button>
    </div>
  );
}
