package nsbm.dea.lms.quiz_service.service;

import nsbm.dea.lms.quiz_service.dto.AnswerOptionResponse;
import nsbm.dea.lms.quiz_service.dto.QuestionViewResponse;
import nsbm.dea.lms.quiz_service.dto.QuizSummaryResponse;
import nsbm.dea.lms.quiz_service.dto.StartQuizResponse;
import nsbm.dea.lms.quiz_service.dto.SubmitQuizRequest;
import nsbm.dea.lms.quiz_service.dto.SubmitQuizResponse;
import nsbm.dea.lms.quiz_service.dto.SubmittedAnswer;
import nsbm.dea.lms.quiz_service.entity.Answer;
import nsbm.dea.lms.quiz_service.entity.Question;
import nsbm.dea.lms.quiz_service.entity.Quiz;
import nsbm.dea.lms.quiz_service.entity.QuizAttempt;
import nsbm.dea.lms.quiz_service.entity.QuizQuestion;
import nsbm.dea.lms.quiz_service.entity.QuizStatus;
import nsbm.dea.lms.quiz_service.exception.BadRequestException;
import nsbm.dea.lms.quiz_service.exception.ResourceNotFoundException;
import nsbm.dea.lms.quiz_service.repository.AnswerRepository;
import nsbm.dea.lms.quiz_service.repository.QuestionRepository;
import nsbm.dea.lms.quiz_service.repository.QuizAttemptRepository;
import nsbm.dea.lms.quiz_service.repository.QuizQuestionRepository;
import nsbm.dea.lms.quiz_service.repository.QuizRepository;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/*
  Implements ClientQuizService
  Uses repositories to read quiz data for students.
*/
@Service
public class ClientQuizServiceImpl implements ClientQuizService {

    private final QuizRepository quizRepository;
    private final QuizQuestionRepository quizQuestionRepository;
    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final QuizAttemptRepository quizAttemptRepository;

    public ClientQuizServiceImpl(QuizRepository quizRepository,
                                 QuizQuestionRepository quizQuestionRepository,
                                 QuestionRepository questionRepository,
                                 AnswerRepository answerRepository,
                                 QuizAttemptRepository quizAttemptRepository) {
        this.quizRepository = quizRepository;
        this.quizQuestionRepository = quizQuestionRepository;
        this.questionRepository = questionRepository;
        this.answerRepository = answerRepository;
        this.quizAttemptRepository = quizAttemptRepository;
    }

    // Student sees ACTIVE quizzes under a class
    @Override
    public List<QuizSummaryResponse> getActiveQuizzesByClassId(Long classId) {

        List<Quiz> quizzes = quizRepository.findByClassIdAndStatus(classId, QuizStatus.ACTIVE);

        List<QuizSummaryResponse> responseList = new ArrayList<>();

        for (Quiz quiz : quizzes) {
            int mappedQuestionCount;
            if (quiz.getQuestionCount() != null && quiz.getQuestionCount() > 0) {
                mappedQuestionCount = quiz.getQuestionCount();
            } else {
                List<QuizQuestion> mappings = quizQuestionRepository.findByQuizId(quiz.getQuizId());
                Set<Long> mappedQuestionIds = new LinkedHashSet<>();
                for (QuizQuestion mapping : mappings) {
                    if (mapping.getQuestionId() != null) {
                        mappedQuestionIds.add(mapping.getQuestionId());
                    }
                }

                if (mappedQuestionIds.isEmpty()) {
                    mappedQuestionCount = 0;
                } else {
                    mappedQuestionCount = questionRepository.findAllById(mappedQuestionIds).size();
                }
            }

            QuizSummaryResponse dto = new QuizSummaryResponse();
            dto.setQuizId(quiz.getQuizId());
            dto.setQuizName(quiz.getQuizName());
            dto.setTimeLimitMinutes(quiz.getTimeLimitMinutes() != null ? quiz.getTimeLimitMinutes() : 0);
            dto.setQuestionCount(mappedQuestionCount);
            dto.setPassingPercentage(quiz.getPassingScore() != null ? quiz.getPassingScore() : 0);
            dto.setStatus(quiz.getStatus() != null ? quiz.getStatus().name() : QuizStatus.INACTIVE.name());
            responseList.add(dto);
        }

        return responseList;
    }

    /*
      Student starts a quiz:
      - quiz must exist
      - quiz must be ACTIVE
      - load selected questions
      - if no questions, block
      - return answers WITHOUT correct flags
    */
    @Override
    public StartQuizResponse startQuiz(Long quizId) {

        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found: " + quizId));

        if (quiz.getStatus() != QuizStatus.ACTIVE) {
            throw new ResourceNotFoundException("Quiz is not ACTIVE: " + quizId);
        }

        List<QuizQuestion> quizQuestions = quizQuestionRepository.findByQuizId(quizId);

        if (quizQuestions.isEmpty()) {
            throw new BadRequestException("No questions assigned to this quiz.");
        }

        Collections.shuffle(quizQuestions);
        Set<Long> mappedQuestionIds = new LinkedHashSet<>();
        for (QuizQuestion qq : quizQuestions) {
            if (qq.getQuestionId() != null) {
                mappedQuestionIds.add(qq.getQuestionId());
            }
        }
        if (mappedQuestionIds.isEmpty()) {
            throw new BadRequestException("No valid questions assigned to this quiz.");
        }

        Map<Long, Question> questionsById = new HashMap<>();
        for (Question question : questionRepository.findAllById(mappedQuestionIds)) {
            questionsById.put(question.getQuestionId(), question);
        }

        List<QuestionViewResponse> questionResponses = new ArrayList<>();

        for (QuizQuestion qq : quizQuestions) {

            Long questionId = qq.getQuestionId();
            if (questionId == null) {
                continue;
            }

            Question question = questionsById.get(questionId);
            if (question == null) {
                continue;
            }

            List<Answer> answers = answerRepository.findByQuestionQuestionId(questionId);

            List<AnswerOptionResponse> answerResponses = new ArrayList<>();

            for (Answer answer : answers) {
                AnswerOptionResponse answerDto =
                        new AnswerOptionResponse(answer.getAnswerId(), answer.getAnswerText());
                answerResponses.add(answerDto);
            }

            QuestionViewResponse questionDto = new QuestionViewResponse(
                    question.getQuestionId(),
                    question.getQuestionText(),
                    answerResponses
            );

            questionResponses.add(questionDto);
        }

        if (questionResponses.isEmpty()) {
            throw new BadRequestException("No valid questions assigned to this quiz.");
        }

        StartQuizResponse response = new StartQuizResponse();
        response.setQuizId(quiz.getQuizId());
        response.setQuizName(quiz.getQuizName());
        response.setTimeLimitMinutes(quiz.getTimeLimitMinutes());
        response.setQuestions(questionResponses);

        return response;
    }

    /*
      submitQuiz FINAL:
      - validate request (studentId, startedAt, answers)
      - enforce attempt limit from quiz setting
      - block future startedAt
      - enforce timer
      - block if no questions assigned
      - block too many answers
      - validate answers (anti-cheat)
      - calculate score
      - save attempt
    */
    @Override
    public SubmitQuizResponse submitQuiz(Long quizId, SubmitQuizRequest request) {

        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found: " + quizId));

        if (quiz.getStatus() != QuizStatus.ACTIVE) {
            throw new BadRequestException("Quiz is not ACTIVE: " + quizId);
        }

        if (request == null) {
            throw new BadRequestException("Request body is missing.");
        }
        if (request.getStudentId() == null) {
            throw new BadRequestException("studentId is required.");
        }
        if (request.getStartedAt() == null) {
            throw new BadRequestException("startedAt is required.");
        }
        if (request.getAnswers() == null || request.getAnswers().isEmpty()) {
            throw new BadRequestException("answers list is empty.");
        }

        Long studentId = request.getStudentId();

        long usedAttempts = quizAttemptRepository.countByQuizIdAndStudentId(quizId, studentId);
        int allowedAttempts = (quiz.getAttemptCount() != null && quiz.getAttemptCount() > 0)
                ? quiz.getAttemptCount()
                : 1;

        if (usedAttempts >= allowedAttempts) {
            throw new BadRequestException("Maximum attempts reached for this quiz.");
        }

        LocalDateTime now = LocalDateTime.now();

        if (request.getStartedAt().isAfter(now)) {
            throw new BadRequestException("startedAt cannot be in the future.");
        }

        long minutesTaken = Duration.between(request.getStartedAt(), now).toMinutes();

        if (quiz.getTimeLimitMinutes() != null && minutesTaken > quiz.getTimeLimitMinutes()) {
            throw new BadRequestException("Quiz time limit exceeded.");
        }

        List<QuizQuestion> selectedQuestions = quizQuestionRepository.findByQuizId(quizId);

        if (selectedQuestions.isEmpty()) {
            throw new BadRequestException("No questions assigned to this quiz.");
        }

        Set<Long> validQuestionIds = new LinkedHashSet<>();
        Set<Long> mappedQuestionIds = new LinkedHashSet<>();
        for (QuizQuestion selectedQuestion : selectedQuestions) {
            if (selectedQuestion.getQuestionId() != null) {
                mappedQuestionIds.add(selectedQuestion.getQuestionId());
            }
        }
        for (Question question : questionRepository.findAllById(mappedQuestionIds)) {
            validQuestionIds.add(question.getQuestionId());
        }

        if (validQuestionIds.isEmpty()) {
            throw new BadRequestException("No valid questions assigned to this quiz.");
        }

        int totalQuestions = validQuestionIds.size();

        if (request.getAnswers().size() > totalQuestions) {
            throw new BadRequestException("Too many answers submitted.");
        }

        int correctCount = 0;
        List<Long> seenQuestions = new ArrayList<>();

        for (SubmittedAnswer submitted : request.getAnswers()) {

            if (submitted.getQuestionId() == null || submitted.getAnswerId() == null) {
                throw new BadRequestException("questionId and answerId must not be null.");
            }

            Long questionId = submitted.getQuestionId();
            Long answerId = submitted.getAnswerId();

            if (seenQuestions.contains(questionId)) {
                throw new BadRequestException("Duplicate answer submitted for questionId: " + questionId);
            }
            seenQuestions.add(questionId);

            boolean questionInQuiz = validQuestionIds.contains(questionId);
            if (!questionInQuiz) {
                throw new BadRequestException("Question " + questionId + " does not belong to quiz " + quizId);
            }

            boolean answerInQuestion = answerRepository.existsByAnswerIdAndQuestionQuestionId(answerId, questionId);
            if (!answerInQuestion) {
                throw new BadRequestException("Answer " + answerId + " does not belong to question " + questionId);
            }

            Answer answer = answerRepository.findById(answerId)
                    .orElseThrow(() -> new ResourceNotFoundException("Answer not found: " + answerId));

            if (answer.isCorrect()) {
                correctCount++;
            }
        }

        int scorePercentage = 0;
        if (totalQuestions > 0) {
            scorePercentage = (correctCount * 100) / totalQuestions;
        }

        boolean passed = scorePercentage >= quiz.getPassingScore();

        QuizAttempt attempt = new QuizAttempt();
        attempt.setQuizId(quizId);
        attempt.setStudentId(studentId);
        attempt.setScorePercentage(scorePercentage);
        attempt.setPassed(passed);
        attempt.setStartedAt(request.getStartedAt());
        attempt.setSubmittedAt(now);

        quizAttemptRepository.save(attempt);

        SubmitQuizResponse response = new SubmitQuizResponse();
        response.setTotalQuestions(totalQuestions);
        response.setCorrectAnswers(correctCount);
        response.setScorePercentage(scorePercentage);
        response.setPassed(passed);

        return response;
    }
}
