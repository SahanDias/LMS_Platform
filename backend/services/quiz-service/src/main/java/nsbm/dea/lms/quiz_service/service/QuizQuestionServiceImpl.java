package nsbm.dea.lms.quiz_service.service;

import nsbm.dea.lms.quiz_service.dto.SelectQuestionsRequest;
import nsbm.dea.lms.quiz_service.entity.Question;
import nsbm.dea.lms.quiz_service.entity.QuizQuestion;
import nsbm.dea.lms.quiz_service.exception.BadRequestException;
import nsbm.dea.lms.quiz_service.exception.ResourceNotFoundException;
import nsbm.dea.lms.quiz_service.repository.QuestionRepository;
import nsbm.dea.lms.quiz_service.repository.QuizQuestionRepository;
import nsbm.dea.lms.quiz_service.repository.QuizRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

/*
    Implements QuizQuestionService
*/

@Service
public class QuizQuestionServiceImpl implements QuizQuestionService {

    // DEPENDENCY

    private final QuizQuestionRepository quizQuestionRepository;
    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;

    public QuizQuestionServiceImpl(
            QuizQuestionRepository quizQuestionRepository,
            QuizRepository quizRepository,
            QuestionRepository questionRepository
    ) {
        this.quizQuestionRepository = quizQuestionRepository;
        this.quizRepository = quizRepository;
        this.questionRepository = questionRepository;
    }

    // ASSIGN QUESTIONS

    @Override
    @Transactional
    public void assignQuestionsToQuiz(Long quizId, SelectQuestionsRequest request) {
        if (quizId == null || quizId <= 0) {
            throw new BadRequestException("quizId must be a positive number.");
        }
        if (request == null) {
            throw new BadRequestException("Request body is required.");
        }
        if (!quizRepository.existsById(quizId)) {
            throw new ResourceNotFoundException("Quiz not found: " + quizId);
        }

        List<Long> incomingIds = request.getQuestionIds();
        if (incomingIds == null) {
            incomingIds = List.of();
        }

        Set<Long> uniqueQuestionIds = new LinkedHashSet<>();
        for (Long questionId : incomingIds) {
            if (questionId == null || questionId <= 0) {
                throw new BadRequestException("questionIds must contain only positive numbers.");
            }
            uniqueQuestionIds.add(questionId);
        }

        if (!uniqueQuestionIds.isEmpty()) {
            List<Question> existingQuestions = questionRepository.findAllById(uniqueQuestionIds);
            if (existingQuestions.size() != uniqueQuestionIds.size()) {
                throw new BadRequestException("One or more selected question IDs do not exist.");
            }
        }

        // Additive mode: keep existing mappings and insert only missing ones.
        // This avoids destructive deletes that can fail when historical attempt data exists.
        if (uniqueQuestionIds.isEmpty()) {
            return;
        }

        Set<Long> existingQuestionIds = new LinkedHashSet<>();
        for (QuizQuestion row : quizQuestionRepository.findByQuizId(quizId)) {
            if (row.getQuestionId() != null) {
                existingQuestionIds.add(row.getQuestionId());
            }
        }

        List<QuizQuestion> newMappings = new ArrayList<>();
        for (Long questionId : uniqueQuestionIds) {
            if (existingQuestionIds.contains(questionId)) {
                continue;
            }
            QuizQuestion mapping = new QuizQuestion();
            mapping.setQuizId(quizId);
            mapping.setQuestionId(questionId);
            newMappings.add(mapping);
        }

        if (!newMappings.isEmpty()) {
            quizQuestionRepository.saveAll(newMappings);
        }
    }

    // GET SELECTED

    @Override
    public List<QuizQuestion> getSelectedQuestions(Long quizId) {
        return quizQuestionRepository.findByQuizId(quizId);
    }

    // CLEAR ALL

    @Override
    @Transactional
    public void clearQuizQuestions(Long quizId) {
        try {
            quizQuestionRepository.deleteByQuizId(quizId);
        } catch (DataIntegrityViolationException ex) {
            throw new BadRequestException("Cannot clear selected questions because attempts already exist for this quiz.");
        }
    }
}
