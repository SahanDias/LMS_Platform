package nsbm.dea.lms.quiz_service.service;

import nsbm.dea.lms.quiz_service.dto.CreateAnswerRequest;
import nsbm.dea.lms.quiz_service.dto.CreateQuestionRequest;
import nsbm.dea.lms.quiz_service.entity.Answer;
import nsbm.dea.lms.quiz_service.entity.Question;
import nsbm.dea.lms.quiz_service.exception.ResourceNotFoundException;
import nsbm.dea.lms.quiz_service.repository.AnswerRepository;
import nsbm.dea.lms.quiz_service.repository.QuestionRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/*
  Implements QuestionService
*/

@Service
public class QuestionServiceImpl implements QuestionService {

    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;

    public QuestionServiceImpl(QuestionRepository questionRepository,
                               AnswerRepository answerRepository) {
        this.questionRepository = questionRepository;
        this.answerRepository = answerRepository;
    }

        // CREATE QUESTION

    @Override
    public Question createQuestion(CreateQuestionRequest request) {

        // 1) Save question first
        Question question = new Question();
        question.setCourseId(request.getCourseId());
        question.setClassId(request.getClassId());
        question.setQuestionText(request.getQuestionText());
        question.setQuestionType(request.getQuestionType());

        Question savedQuestion = questionRepository.save(question);

        // 2) Save answers for that question
        if (request.getAnswers() != null) {

            for (CreateAnswerRequest dto : request.getAnswers()) {
                Answer answer = new Answer();
                answer.setQuestion(savedQuestion);
                answer.setAnswerText(dto.getAnswerText());
                answer.setCorrect(dto.isCorrect());

                answerRepository.save(answer);
            }
        }

        return savedQuestion;
    }

    // GET QUESTIONS

    @Override
    public List<Question> getQuestions(Long courseId, Long classId) {

        if (classId != null) return questionRepository.findByClassId(classId);
        if (courseId != null) return questionRepository.findByCourseId(courseId);

        return questionRepository.findAll();
    }

    // GET BY ID

    @Override
    public Question getQuestionById(Long questionId) {
        return questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found: " + questionId));
    }

    // DELETE QUESTION
    @Override
    public void deleteQuestion(Long questionId) {

        // Ensure question exists
        Question question = getQuestionById(questionId);

        // Delete answers first (avoid FK issues)
        List<Answer> answers = answerRepository.findByQuestionQuestionId(questionId);
        if (answers != null) {
            answerRepository.deleteAll(answers);
        }

        // Delete question
        questionRepository.delete(question);
    }
}