package nsbm.dea.lms.quiz_service.dto;

/*
  Result returned to student after submitting quiz
*/
public class SubmitQuizResponse {

    private Integer totalQuestions;
    private Integer correctAnswers;
    private Integer scorePercentage;
    private Boolean passed;

    public SubmitQuizResponse() { }

    public Integer getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(Integer totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public Integer getCorrectAnswers() {
        return correctAnswers;
    }

    public void setCorrectAnswers(Integer correctAnswers) {
        this.correctAnswers = correctAnswers;
    }

    public Integer getScorePercentage() {
        return scorePercentage;
    }

    public void setScorePercentage(Integer scorePercentage) {
        this.scorePercentage = scorePercentage;
    }

    public Boolean getPassed() {
        return passed;
    }

    public void setPassed(Boolean passed) {
        this.passed = passed;
    }

    @Override
    public String toString() {
        return "SubmitQuizResponse{" +
                "totalQuestions=" + totalQuestions +
                ", correctAnswers=" + correctAnswers +
                ", scorePercentage=" + scorePercentage +
                ", passed=" + passed +
                '}';
    }
}