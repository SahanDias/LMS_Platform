package nsbm.dea.lms.quiz_service.service;

import nsbm.dea.lms.quiz_service.dto.CreateQuestionRequest;
import nsbm.dea.lms.quiz_service.entity.Question;

import java.util.List;

/*
    Admin Question Bank operations
*/
public interface QuestionService {

    // Create question + answers
    Question createQuestion(CreateQuestionRequest request);

    // Get all questions (filter optional)
    List<Question> getQuestions(Long courseId, Long classId);

    // Get one question by id
    Question getQuestionById(Long questionId);

    // Delete question (also delete answers)
    void deleteQuestion(Long questionId);
}