package nsbm.dea.lms.quiz_service.dto;

import nsbm.dea.lms.quiz_service.entity.ExamRequirement;
import nsbm.dea.lms.quiz_service.entity.QuestionOrder;
import nsbm.dea.lms.quiz_service.entity.QuizStatus;

/*
 Receives Quiz form data from Admin UI
  Used In       : Admin creates or updates a quiz
*/

public class CreateQuizRequest {

    // ATTRIBUTES

    private String quizName;
    private Long courseId;
    private Long classId;

    private Integer passingScore;       // 0 - 100
    private Integer timeLimitMinutes;   // store total minutes

    private Integer attemptCount;
    private Integer questionCount;

    private QuizStatus status;               // ACTIVE / INACTIVE
    private QuestionOrder questionOrder;     // RANDOM / SEQUENTIAL
    private ExamRequirement examRequirement; // OPTIONAL / MUST_TAKE / MUST_PASS

    // CONSTRUCTORS

    public CreateQuizRequest() { }

    // GETTERS and SETTERS

    public String getQuizName() {
        return quizName;
    }

    public void setQuizName(String quizName) {
        this.quizName = quizName;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public Long getClassId() {
        return classId;
    }

    public void setClassId(Long classId) {
        this.classId = classId;
    }

    public Integer getPassingScore() {
        return passingScore;
    }

    public void setPassingScore(Integer passingScore) {
        this.passingScore = passingScore;
    }

    public Integer getTimeLimitMinutes() {
        return timeLimitMinutes;
    }

    public void setTimeLimitMinutes(Integer timeLimitMinutes) {
        this.timeLimitMinutes = timeLimitMinutes;
    }

    public Integer getAttemptCount() {
        return attemptCount;
    }

    public void setAttemptCount(Integer attemptCount) {
        this.attemptCount = attemptCount;
    }

    public Integer getQuestionCount() {
        return questionCount;
    }

    public void setQuestionCount(Integer questionCount) {
        this.questionCount = questionCount;
    }

    public QuizStatus getStatus() {
        return status;
    }

    public void setStatus(QuizStatus status) {
        this.status = status;
    }

    public QuestionOrder getQuestionOrder() {
        return questionOrder;
    }

    public void setQuestionOrder(QuestionOrder questionOrder) {
        this.questionOrder = questionOrder;
    }

    public ExamRequirement getExamRequirement() {
        return examRequirement;
    }

    public void setExamRequirement(ExamRequirement examRequirement) {
        this.examRequirement = examRequirement;
    }

    // toString()

    @Override
    public String toString() {
        return "CreateQuizRequest{" +
                "quizName='" + quizName + '\'' +
                ", courseId=" + courseId +
                ", classId=" + classId +
                ", passingScore=" + passingScore +
                ", timeLimitMinutes=" + timeLimitMinutes +
                ", attemptCount=" + attemptCount +
                ", questionCount=" + questionCount +
                ", status=" + status +
                ", questionOrder=" + questionOrder +
                ", examRequirement=" + examRequirement +
                '}';
    }
}