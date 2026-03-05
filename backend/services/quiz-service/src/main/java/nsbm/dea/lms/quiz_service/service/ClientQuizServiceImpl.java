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
import java.util.List;

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

    // limit (simple rule)
    private static final int MAX_ATTEMPTS = 3;

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
            QuizSummaryResponse dto = new QuizSummaryResponse(
                    quiz.getQuizId(),
                    quiz.getQuizName(),
                    quiz.getTimeLimitMinutes(),
                    quiz.getQuestionCount()
            );
            responseList.add(dto);
        }

        return responseList;
    }

    /*
      Student starts a quiz:
      - quiz must exist
      - quiz must be ACTIVE
      - load selected questions
      - shuffle questions (random order)
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
        Collections.shuffle(quizQuestions);

        List<QuestionViewResponse> questionResponses = new ArrayList<>();

        for (QuizQuestion qq : quizQuestions) {

            Long questionId = qq.getQuestionId();

            Question question = questionRepository.findById(questionId)
                    .orElseThrow(() -> new ResourceNotFoundException("Question not found: " + questionId));

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
      - enforce attempt limit
      - enforce timer
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

        // Validate request fields
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

        // Attempt limit check
        long usedAttempts = quizAttemptRepository.countByQuizIdAndStudentId(quizId, studentId);
        if (usedAttempts >= MAX_ATTEMPTS) {
            throw new BadRequestException("Maximum attempts reached for this quiz.");
        }

        // Timer enforcement
        LocalDateTime now = LocalDateTime.now();
        long minutesTaken = Duration.between(request.getStartedAt(), now).toMinutes();

        if (quiz.getTimeLimitMinutes() != null && minutesTaken > quiz.getTimeLimitMinutes()) {
            throw new BadRequestException("Quiz time limit exceeded.");
        }

        // Total questions = selected questions count
        List<QuizQuestion> selectedQuestions = quizQuestionRepository.findByQuizId(quizId);
        int totalQuestions = selectedQuestions.size();

        int correctCount = 0;

        // Prevent duplicate question submission
        List<Long> seenQuestions = new ArrayList<>();

        // Validate each submitted answer (anti-cheat)
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

            // Question must belong to quiz
            boolean questionInQuiz = quizQuestionRepository.existsByQuizIdAndQuestionId(quizId, questionId);
            if (!questionInQuiz) {
                throw new BadRequestException("Question " + questionId + " does not belong to quiz " + quizId);
            }

            // Answer must belong to question
            boolean answerInQuestion = answerRepository.existsByAnswerIdAndQuestionQuestionId(answerId, questionId);
            if (!answerInQuestion) {
                throw new BadRequestException("Answer " + answerId + " does not belong to question " + questionId);
            }

            // Now check correctness
            Answer answer = answerRepository.findById(answerId)
                    .orElseThrow(() -> new ResourceNotFoundException("Answer not found: " + answerId));

            if (answer.isCorrect()) {
                correctCount++;
            }
        }

        // Calculate score
        int scorePercentage = 0;
        if (totalQuestions > 0) {
            scorePercentage = (correctCount * 100) / totalQuestions;
        }

        boolean passed = scorePercentage >= quiz.getPassingScore();

        // Save attempt in DB
        QuizAttempt attempt = new QuizAttempt();
        attempt.setQuizId(quizId);
        attempt.setStudentId(studentId);
        attempt.setScorePercentage(scorePercentage);
        attempt.setPassed(passed);
        attempt.setStartedAt(request.getStartedAt());
        attempt.setSubmittedAt(now);

        quizAttemptRepository.save(attempt);

        // Response
        SubmitQuizResponse response = new SubmitQuizResponse();
        response.setTotalQuestions(totalQuestions);
        response.setCorrectAnswers(correctCount);
        response.setScorePercentage(scorePercentage);
        response.setPassed(passed);

        return response;
    }
}