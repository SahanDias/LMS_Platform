package nsbm.dea.lms.quiz_service.entity;

import jakarta.persistence.*;

/*
  Mapping table between Quiz and Question
  Responsibility:
     - Stores which questions are selected for a quiz
     - Keeps quizId + questionId only (simple & microservice friendly)
*/

@Entity
@Table(name = "quiz_questions")
public class QuizQuestion {

    // ATTRIBUTES

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long quizId;     // reference to Quiz
    private Long questionId; // reference to Question


    // CONSTRUCTORS

    public QuizQuestion() {}

    // GETTERS and SETTERS

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getQuizId() {
        return quizId;
    }

    public void setQuizId(Long quizId) {
        this.quizId = quizId;
    }

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    // toString()

    @Override
    public String toString() {
        return "QuizQuestion{" +
                "id=" + id +
                ", quizId=" + quizId +
                ", questionId=" + questionId +
                '}';
    }
}