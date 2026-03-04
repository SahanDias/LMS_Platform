package nsbm.dea.lms.quiz_service.dto;

import java.util.List;

/*
  Client Response DTO:
  Full quiz info shown to student when starting a quiz
*/
public class StartQuizResponse {

    private Long quizId;
    private String quizName;
    private Integer timeLimitMinutes;

    private List<QuestionViewResponse> questions;

    public StartQuizResponse() { }

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

    public List<QuestionViewResponse> getQuestions() {
        return questions;
    }

    public void setQuestions(List<QuestionViewResponse> questions) {
        this.questions = questions;
    }

    @Override
    public String toString() {
        return "StartQuizResponse{" +
                "quizId=" + quizId +
                ", quizName='" + quizName + '\'' +
                ", timeLimitMinutes=" + timeLimitMinutes +
                ", questions=" + (questions != null ? questions.size() : 0) +
                '}';
    }
}