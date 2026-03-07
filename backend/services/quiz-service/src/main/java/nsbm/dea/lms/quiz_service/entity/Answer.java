package nsbm.dea.lms.quiz_service.entity;

import jakarta.persistence.*;

/*
  Represents an Answer option for a Question
  Responsibility:
     - Stores answer text
     - Stores whether answer is correct (true/false)
     - Linked to Question using Many-to-One relationship
*/

@Entity
@Table(name = "answers")
public class Answer {

    // ATTRIBUTES
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long answerId;

    @ManyToOne
    @JoinColumn(name = "question_id", nullable = false)
    private Question question; // Which question this answer belongs to

    @Column(nullable = false)
    private String answerText;

    private boolean correct; // true = correct answer


   // CONSTRUCTORS

    public Answer() {}


    // GETTERS and SETTERS

    public Long getAnswerId() {
        return answerId;
    }

    public void setAnswerId(Long answerId) {
        this.answerId = answerId;
    }

    public Question getQuestion() {
        return question;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }

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

    //toString()

    @Override
    public String toString() {
        return "Answer{" +
                "answerId=" + answerId +
                ", questionId=" + (question != null ? question.getQuestionId() : null) +
                ", answerText='" + answerText + '\'' +
                ", correct=" + correct +
                '}';
    }
}