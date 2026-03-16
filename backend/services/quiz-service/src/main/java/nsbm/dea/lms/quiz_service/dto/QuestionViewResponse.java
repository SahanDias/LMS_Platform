package nsbm.dea.lms.quiz_service.dto;

import java.util.List;

/*
  Client Response DTO:
  Question shown to student with answer options
*/
public class QuestionViewResponse {

    private Long questionId;
    private String questionText;

    private List<AnswerOptionResponse> answers;

    public QuestionViewResponse() { }

    public QuestionViewResponse(Long questionId, String questionText,
                                List<AnswerOptionResponse> answers) {
        this.questionId = questionId;
        this.questionText = questionText;
        this.answers = answers;
    }

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public List<AnswerOptionResponse> getAnswers() {
        return answers;
    }

    public void setAnswers(List<AnswerOptionResponse> answers) {
        this.answers = answers;
    }

    @Override
    public String toString() {
        return "QuestionViewResponse{" +
                "questionId=" + questionId +
                ", questionText='" + questionText + '\'' +
                ", answers=" + (answers != null ? answers.size() : 0) +
                '}';
    }
}