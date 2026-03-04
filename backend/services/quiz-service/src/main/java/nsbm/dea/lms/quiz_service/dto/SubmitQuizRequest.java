package nsbm.dea.lms.quiz_service.dto;

import java.util.List;

/*
  Client sends selected answers to submit a quiz attempt
*/
public class SubmitQuizRequest {

    private List<SubmittedAnswer> answers;

    public SubmitQuizRequest() { }

    public List<SubmittedAnswer> getAnswers() {
        return answers;
    }

    public void setAnswers(List<SubmittedAnswer> answers) {
        this.answers = answers;
    }

    @Override
    public String toString() {
        return "SubmitQuizRequest{" +
                "answers=" + (answers != null ? answers.size() : 0) +
                '}';
    }
}