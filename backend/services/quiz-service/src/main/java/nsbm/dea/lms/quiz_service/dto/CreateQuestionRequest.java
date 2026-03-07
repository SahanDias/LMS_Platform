package nsbm.dea.lms.quiz_service.dto;

import nsbm.dea.lms.quiz_service.entity.QuestionType;

import java.util.List;

/*
 Receives question + answers from Admin UI
*/

public class CreateQuestionRequest {

    // ATTRIBUTES

    private Long courseId;
    private Long classId;

    private String questionText;
    private QuestionType questionType; // SINGLE / MULTIPLE

    private List<CreateAnswerRequest> answers; // answer options list


    //  CONSTRUCTORS

    public CreateQuestionRequest() { }

    // GETTERS and SETTERS

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

    public QuestionType getQuestionType() {
        return questionType;
    }

    public void setQuestionType(QuestionType questionType) {
        this.questionType = questionType;
    }

    public List<CreateAnswerRequest> getAnswers() {
        return answers;
    }

    public void setAnswers(List<CreateAnswerRequest> answers) {
        this.answers = answers;
    }

    // toString()

    @Override
    public String toString() {
        return "CreateQuestionRequest{" +
                "courseId=" + courseId +
                ", classId=" + classId +
                ", questionText='" + questionText + '\'' +
                ", questionType=" + questionType +
                ", answers=" + (answers != null ? answers.size() : 0) +
                '}';
    }
}