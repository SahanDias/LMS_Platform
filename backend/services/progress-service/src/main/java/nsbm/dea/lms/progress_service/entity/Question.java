package nsbm.dea.lms.progress_service.entity;

import jakarta.persistence.*;

/*
    Represents a Question in the Question Bank
  Responsibility:
     - Stores question text and question type (SINGLE/MULTIPLE)
     - Connected to Course/Class using IDs (because other services own them)
*/

@Entity
@Table(name = "questions")
public class Question {

    // ATTRIBUTES

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long questionId;

    private Long courseId; // reference ID from Course Service
    private Long classId;  // reference ID from Class Service

    @Column(nullable = false, length = 1000)
    private String questionText;




    // CONSTRUCTORS

    public Question() {}

    // GETTERS and SETTERS

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
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

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

   //toString()

    @Override
    public String toString() {
        return "Question{" +
                "questionId=" + questionId +
                ", courseId=" + courseId +
                ", classId=" + classId +
                ", questionText='" + questionText + '\'' +
                ", questionType="  +
                '}';
    }
}