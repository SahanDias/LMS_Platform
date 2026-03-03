package nsbm.dea.lms.quiz_service.service;

import nsbm.dea.lms.quiz_service.entity.Quiz;
import nsbm.dea.lms.quiz_service.repository.QuizRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/*
 Implements QuizService interface
*/

@Service
public class QuizServiceImpl implements QuizService {

    private final QuizRepository quizRepository;

    // Constructor Injection
    public QuizServiceImpl(QuizRepository quizRepository) {
        this.quizRepository = quizRepository;
    }

    /* ================================
       ========== SAVE QUIZ ===========
       ================================ */
    @Override
    public Quiz saveQuiz(Quiz quiz) {
        return quizRepository.save(quiz);
    }

    /* ================================
       ========== GET ALL QUIZZES =====
       ================================ */
    @Override
    public List<Quiz> getAllQuizzes() {
        return quizRepository.findAll();
    }

    /* ================================
       ========== GET BY ID ===========
       ================================ */
    @Override
    public Quiz getQuizById(Long quizId) {
        Optional<Quiz> quiz = quizRepository.findById(quizId);

        if (quiz.isPresent()) {
            return quiz.get();
        } else {
            throw new RuntimeException("Quiz not found with id: " + quizId);
        }
    }

    /* ================================
       ========== DELETE QUIZ =========
       ================================ */
    @Override
    public void deleteQuiz(Long quizId) {
        quizRepository.deleteById(quizId);
    }
}