package nsbm.dea.lms.quiz_service.service;

import nsbm.dea.lms.quiz_service.dto.CreateQuizRequest;
import nsbm.dea.lms.quiz_service.entity.Quiz;
import nsbm.dea.lms.quiz_service.entity.QuizStatus;
import nsbm.dea.lms.quiz_service.exception.ResourceNotFoundException;
import nsbm.dea.lms.quiz_service.repository.QuizRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/*
  Implements QuizService (Admin Quiz logic)
*/

@Service
public class QuizServiceImpl implements QuizService {

    private final QuizRepository quizRepository;

    public QuizServiceImpl(QuizRepository quizRepository) {
        this.quizRepository = quizRepository;
    }

    // CREATE QUIZ
    @Override
    public Quiz createQuiz(CreateQuizRequest request) {

        Quiz quiz = new Quiz();
        quiz.setQuizName(request.getQuizName());
        quiz.setCourseId(request.getCourseId());
        quiz.setClassId(request.getClassId());
        quiz.setPassingScore(request.getPassingScore());
        quiz.setTimeLimitMinutes(request.getTimeLimitMinutes());
        quiz.setAttemptCount(request.getAttemptCount());
        quiz.setQuestionCount(request.getQuestionCount());
        quiz.setStatus(request.getStatus());
        quiz.setQuestionOrder(request.getQuestionOrder());
        quiz.setExamRequirement(request.getExamRequirement());

        return quizRepository.save(quiz);
    }

    // GET QUIZZES
    @Override
    public List<Quiz> getAllQuizzes(Long courseId, Long classId) {

        if (classId != null) {
            return quizRepository.findByClassId(classId);
        }

        if (courseId != null) {
            return quizRepository.findByCourseId(courseId);
        }

        return quizRepository.findAll();
    }

    // GET QUIZ BY ID
    @Override
    public Quiz getQuizById(Long quizId) {
        return quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found: " + quizId));
    }

    // UPDATE QUIZ
    @Override
    public Quiz updateQuiz(Long quizId, CreateQuizRequest request) {

        Quiz existingQuiz = getQuizById(quizId);

        existingQuiz.setQuizName(request.getQuizName());
        existingQuiz.setCourseId(request.getCourseId());
        existingQuiz.setClassId(request.getClassId());
        existingQuiz.setPassingScore(request.getPassingScore());
        existingQuiz.setTimeLimitMinutes(request.getTimeLimitMinutes());
        existingQuiz.setAttemptCount(request.getAttemptCount());
        existingQuiz.setQuestionCount(request.getQuestionCount());
        existingQuiz.setStatus(request.getStatus());
        existingQuiz.setQuestionOrder(request.getQuestionOrder());
        existingQuiz.setExamRequirement(request.getExamRequirement());

        return quizRepository.save(existingQuiz);
    }

    // UPDATE STATUS
    @Override
    public Quiz updateStatus(Long quizId, QuizStatus status) {

        Quiz existingQuiz = getQuizById(quizId);
        existingQuiz.setStatus(status);

        return quizRepository.save(existingQuiz);
    }

    // DELETE QUIZ
    @Override
    public void deleteQuiz(Long quizId) {

        // Check quiz exists before delete
        Quiz existingQuiz = getQuizById(quizId);
        quizRepository.delete(existingQuiz);
    }
}