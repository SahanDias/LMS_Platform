package nsbm.dea.lms.quiz_service.dto;

/*
  Client Response DTO:
  Student quiz list item (ACTIVE quizzes under a class)
*/
public class QuizSummaryResponse {

    private Long quizId;
    private String quizName;
    private Integer timeLimitMinutes;
    private Integer questionCount;

    public QuizSummaryResponse() { }

    public QuizSummaryResponse(Long quizId, String quizName,
                               Integer timeLimitMinutes, Integer questionCount) {
        this.quizId = quizId;
        this.quizName = quizName;
        this.timeLimitMinutes = timeLimitMinutes;
        this.questionCount = questionCount;
    }

    public Long getQuizId() {
        return quizId;
    }

    public void setQuizId(Long quizId) {
        this.quizId = quizId;
    }

    public String getQuizName() {
        return quizName;
    }

    public void setQuizName(String quizName) {
        this.quizName = quizName;
    }

    public Integer getTimeLimitMinutes() {
        return timeLimitMinutes;
    }

    public void setTimeLimitMinutes(Integer timeLimitMinutes) {
        this.timeLimitMinutes = timeLimitMinutes;
    }

    public Integer getQuestionCount() {
        return questionCount;
    }

    public void setQuestionCount(Integer questionCount) {
        this.questionCount = questionCount;
    }

    @Override
    public String toString() {
        return "QuizSummaryResponse{" +
                "quizId=" + quizId +
                ", quizName='" + quizName + '\'' +
                ", timeLimitMinutes=" + timeLimitMinutes +
                ", questionCount=" + questionCount +
                '}';
    }
}