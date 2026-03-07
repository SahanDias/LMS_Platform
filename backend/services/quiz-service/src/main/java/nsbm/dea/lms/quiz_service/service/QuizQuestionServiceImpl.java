package nsbm.dea.lms.quiz_service.service;

import nsbm.dea.lms.quiz_service.dto.SelectQuestionsRequest;
import nsbm.dea.lms.quiz_service.entity.QuizQuestion;
import nsbm.dea.lms.quiz_service.repository.QuizQuestionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/*
    Implements QuizQuestionService
*/

@Service
public class QuizQuestionServiceImpl implements QuizQuestionService {

    // DEPENDENCY

    private final QuizQuestionRepository quizQuestionRepository;

    public QuizQuestionServiceImpl(QuizQuestionRepository quizQuestionRepository) {
        this.quizQuestionRepository = quizQuestionRepository;
    }

    // ASSIGN QUESTIONS

    @Override
    public void assignQuestionsToQuiz(Long quizId, SelectQuestionsRequest request) {

        // 1) Delete existing mappings first (replace mode)
        quizQuestionRepository.deleteByQuizId(quizId);

        // 2) If admin selected question IDs, save new mappings
        if (request.getQuestionIds() != null) {

            for (Long questionId : request.getQuestionIds()) {

                QuizQuestion mapping = new QuizQuestion();
                mapping.setQuizId(quizId);
                mapping.setQuestionId(questionId);

                quizQuestionRepository.save(mapping);
            }
        }
    }

    // GET SELECTED

    @Override
    public List<QuizQuestion> getSelectedQuestions(Long quizId) {
        return quizQuestionRepository.findByQuizId(quizId);
    }

    // CLEAR ALL

    @Override
    public void clearQuizQuestions(Long quizId) {
        quizQuestionRepository.deleteByQuizId(quizId);
    }
}