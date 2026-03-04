package nsbm.dea.lms.quiz_service.service;

import nsbm.dea.lms.quiz_service.dto.CreateQuizRequest;
import nsbm.dea.lms.quiz_service.entity.Quiz;
import nsbm.dea.lms.quiz_service.entity.QuizStatus;

import java.util.List;

/*
 Admin Quiz operations (CRUD + Status)
*/

public interface QuizService {

    //  CREATE QUIZ
    Quiz createQuiz(CreateQuizRequest request);

    // GET QUIZZES
    List<Quiz> getAllQuizzes(Long courseId, Long classId);

    // GET QUIZ BY ID
    Quiz getQuizById(Long quizId);

    // UPDATE QUIZ
    Quiz updateQuiz(Long quizId, CreateQuizRequest request);

    // UPDATE STATUS
    Quiz updateStatus(Long quizId, QuizStatus status);

    // DELETE QUIZ
    void deleteQuiz(Long quizId);
}