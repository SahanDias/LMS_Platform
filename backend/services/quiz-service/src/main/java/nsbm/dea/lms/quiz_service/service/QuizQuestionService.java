package nsbm.dea.lms.quiz_service.service;

import nsbm.dea.lms.quiz_service.dto.SelectQuestionsRequest;
import nsbm.dea.lms.quiz_service.entity.QuizQuestion;

import java.util.List;

/*
    Handles assigning Questions to a Quiz
                   (Quiz Create Page -> Select Question)
*/

public interface QuizQuestionService {

    // ASSIGN QUESTIONS

    // Replace existing selected questions with new list
    void assignQuestionsToQuiz(Long quizId, SelectQuestionsRequest request);

    // GET SELECTED

    // Get selected question mappings for a quiz
    List<QuizQuestion> getSelectedQuestions(Long quizId);

    // CLEAR ALL

    // Remove all selected questions from a quiz
    void clearQuizQuestions(Long quizId);
}