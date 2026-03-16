package nsbm.dea.lms.quiz_service.entity;

import jakarta.persistence.*;

/*
  Represents a Quiz in LMS system
  Responsibility:
     - Stores quiz details
     - Connected to Course and Class using IDs
*/

@Entity
@Table(name = "quizzes")
public class Quiz {

    //ATTRIBUTES
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long quizId;   // Primary Key

    @Column(nullable = false)
    private String quizName;   // Name of the quiz

    private Long courseId;  // Course Service reference
    private Long classId;   // Class Service reference

    private Integer passingScore;        // Percentage (0 - 100)
    private Integer timeLimitMinutes;    // Stored in minutes

    private Integer attemptCount;        // Number of attempts allowed
    private Integer questionCount;       // Number of questions selected

    @Enumerated(EnumType.STRING)
    private QuizStatus status;           // ACTIVE / INACTIVE

    @Enumerated(EnumType.STRING)
    private QuestionOrder questionOrder; // RANDOM / SEQUENTIAL

    @Enumerated(EnumType.STRING)
    private ExamRequirement examRequirement; // OPTIONAL / MUST_TAKE / MUST_PASS

    // toString()

    @Override
    public String toString() {
        return "Quiz{" +
                "quizId=" + quizId +
                ", quizName='" + quizName + '\'' +
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
//GETTERS and SETTERS

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

    // Default constructor required by JPA
    public Quiz() {
    }

}