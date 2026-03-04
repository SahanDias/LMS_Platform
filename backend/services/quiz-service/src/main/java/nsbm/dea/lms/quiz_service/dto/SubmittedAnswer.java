package nsbm.dea.lms.quiz_service.dto;

/*
  One question answer submitted by student
*/
public class SubmittedAnswer {

    private Long questionId;
    private Long answerId;

    public SubmittedAnswer() { }

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public Long getAnswerId() {
        return answerId;
    }

    public void setAnswerId(Long answerId) {
        this.answerId = answerId;
    }

    @Override
    public String toString() {
        return "SubmittedAnswer{" +
                "questionId=" + questionId +
                ", answerId=" + answerId +
                '}';
    }
}