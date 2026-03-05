package nsbm.dea.lms.quiz_service.dto;

import java.time.LocalDateTime;
import java.util.List;

/*
  Client sends selected answers to submit a quiz attempt
*/
public class SubmitQuizRequest {

    // who is attempting the quiz
    private Long studentId;

    // when the student started the quiz (frontend sends this)
    private LocalDateTime startedAt;

    // submitted answers
    private List<SubmittedAnswer> answers;

    public SubmitQuizRequest() { }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(LocalDateTime startedAt) {
        this.startedAt = startedAt;
    }

    public List<SubmittedAnswer> getAnswers() {
        return answers;
    }

    public void setAnswers(List<SubmittedAnswer> answers) {
        this.answers = answers;
    }

    @Override
    public String toString() {
        return "SubmitQuizRequest{" +
                "studentId=" + studentId +
                ", startedAt=" + startedAt +
                ", answers=" + (answers != null ? answers.size() : 0) +
                '}';
    }
}