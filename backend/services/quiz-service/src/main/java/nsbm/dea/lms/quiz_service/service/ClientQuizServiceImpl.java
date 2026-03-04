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
import nsbm.dea.lms.quiz_service.entity.QuizQuestion;
import nsbm.dea.lms.quiz_service.entity.QuizStatus;
import nsbm.dea.lms.quiz_service.exception.ResourceNotFoundException;
import nsbm.dea.lms.quiz_service.repository.AnswerRepository;
import nsbm.dea.lms.quiz_service.repository.QuestionRepository;
import nsbm.dea.lms.quiz_service.repository.QuizQuestionRepository;
import nsbm.dea.lms.quiz_service.repository.QuizRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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

    public ClientQuizServiceImpl(QuizRepository quizRepository,
                                 QuizQuestionRepository quizQuestionRepository,
                                 QuestionRepository questionRepository,
                                 AnswerRepository answerRepository) {
        this.quizRepository = quizRepository;
        this.quizQuestionRepository = quizQuestionRepository;
        this.questionRepository = questionRepository;
        this.answerRepository = answerRepository;
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
      - load selected questions (QuizQuestion table)
      - load answers for each question
      - IMPORTANT: return answers WITHOUT correct flags
    */
    @Override
    public StartQuizResponse startQuiz(Long quizId) {

        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found: " + quizId));

        if (quiz.getStatus() != QuizStatus.ACTIVE) {
            throw new ResourceNotFoundException("Quiz is not ACTIVE: " + quizId);
        }

        // Your repository method is findByQuizId(...)
        List<QuizQuestion> quizQuestions = quizQuestionRepository.findByQuizId(quizId);

        List<QuestionViewResponse> questionResponses = new ArrayList<>();

        for (QuizQuestion qq : quizQuestions) {

            // Your QuizQuestion stores questionId
            Long questionId = qq.getQuestionId();

            Question question = questionRepository.findById(questionId)
                    .orElseThrow(() -> new ResourceNotFoundException("Question not found: " + questionId));

            List<Answer> answers = answerRepository.findByQuestionQuestionId(questionId);

            List<AnswerOptionResponse> answerResponses = new ArrayList<>();

            for (Answer answer : answers) {
                // DO NOT send correct flag to student
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
      Student submits quiz attempt:
      - quiz must exist and ACTIVE
      - calculate correct answers
      - calculate score percentage
      - passed if score >= passingScore
    */
    @Override
    public SubmitQuizResponse submitQuiz(Long quizId, SubmitQuizRequest request) {

        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found: " + quizId));

        if (quiz.getStatus() != QuizStatus.ACTIVE) {
            throw new ResourceNotFoundException("Quiz is not ACTIVE: " + quizId);
        }

        // Total questions should be based on selected questions for quiz
        List<QuizQuestion> selectedQuestions = quizQuestionRepository.findByQuizId(quizId);
        int totalQuestions = selectedQuestions.size();

        int correctCount = 0;

        // If student sends answers
        if (request != null && request.getAnswers() != null) {

            for (SubmittedAnswer submitted : request.getAnswers()) {

                // Load selected answer from DB
                Answer answer = answerRepository.findById(submitted.getAnswerId())
                        .orElseThrow(() -> new ResourceNotFoundException("Answer not found: " + submitted.getAnswerId()));

                // Count correct answers
                if (answer.isCorrect()) {
                    correctCount++;
                }
            }
        }

        int scorePercentage = 0;
        if (totalQuestions > 0) {
            scorePercentage = (correctCount * 100) / totalQuestions;
        }

        boolean passed = scorePercentage >= quiz.getPassingScore();

        SubmitQuizResponse response = new SubmitQuizResponse();
        response.setTotalQuestions(totalQuestions);
        response.setCorrectAnswers(correctCount);
        response.setScorePercentage(scorePercentage);
        response.setPassed(passed);

        return response;
    }
}