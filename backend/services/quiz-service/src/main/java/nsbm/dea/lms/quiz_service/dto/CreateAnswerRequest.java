package nsbm.dea.lms.quiz_service.dto;

/*
Receives one answer option from Admin UI
*/

public class CreateAnswerRequest {

    // ATTRIBUTES

    private String answerText;
    private boolean correct;

    // CONSTRUCTORS

    public CreateAnswerRequest() { }

    // GETTERS and SETTERS

    public String getAnswerText() {
        return answerText;
    }

    public void setAnswerText(String answerText) {
        this.answerText = answerText;
    }

    public boolean isCorrect() {
        return correct;
    }

    public void setCorrect(boolean correct) {
        this.correct = correct;
    }

    // toString()

    @Override
    public String toString() {
        return "CreateAnswerRequest{" +
                "answerText='" + answerText + '\'' +
                ", correct=" + correct +
                '}';
    }
}