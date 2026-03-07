package nsbm.dea.lms.quiz_service.dto;

/*
  Client Response DTO:
  Answer option shown to student (do NOT send correct answer info)
*/
public class AnswerOptionResponse {

    private Long answerId;
    private String answerText;

    public AnswerOptionResponse() { }

    public AnswerOptionResponse(Long answerId, String answerText) {
        this.answerId = answerId;
        this.answerText = answerText;
    }

    public Long getAnswerId() {
        return answerId;
    }

    public void setAnswerId(Long answerId) {
        this.answerId = answerId;
    }

    public String getAnswerText() {
        return answerText;
    }

    public void setAnswerText(String answerText) {
        this.answerText = answerText;
    }

    @Override
    public String toString() {
        return "AnswerOptionResponse{" +
                "answerId=" + answerId +
                ", answerText='" + answerText + '\'' +
                '}';
    }
}