package nsbm.dea.lms.quiz_service.service;

import nsbm.dea.lms.quiz_service.entity.Quiz;

import java.util.List;

/*
    Defines business logic for Quiz operations
*/

public interface QuizService {

     // Save new Quiz

    Quiz saveQuiz(Quiz quiz);

     // Get all quizzes

    List<Quiz> getAllQuizzes();

     // Get quiz by ID

    Quiz getQuizById(Long quizId);

     // Delete quiz

    void deleteQuiz(Long quizId);
}