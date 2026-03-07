package nsbm.dea.lms.quiz_service.controller;

import nsbm.dea.lms.quiz_service.dto.SelectQuestionsRequest;
import nsbm.dea.lms.quiz_service.entity.QuizQuestion;
import nsbm.dea.lms.quiz_service.service.QuizQuestionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/*
  Admin APIs for assigning questions to quizzes
  Base URL      : /api/admin/quizzes/{quizId}/questions
*/

@RestController
@RequestMapping("/api/admin/quizzes/{quizId}/questions")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class QuizQuestionController {

    // DEPENDENCY

    private final QuizQuestionService quizQuestionService;

    public QuizQuestionController(QuizQuestionService quizQuestionService) {
        this.quizQuestionService = quizQuestionService;
    }

    // ASSIGN QUESTIONS

    // This will REPLACE existing selected questions with new list
    @PostMapping
    public void assignQuestionsToQuiz(@PathVariable Long quizId,
                                      @RequestBody SelectQuestionsRequest request) {
        quizQuestionService.assignQuestionsToQuiz(quizId, request);
    }

    // GET SELECTED QUESTIONS
    @GetMapping
    public List<QuizQuestion> getSelectedQuestions(@PathVariable Long quizId) {
        return quizQuestionService.getSelectedQuestions(quizId);
    }

    // CLEAR QUESTIONS
    @DeleteMapping
    public void clearQuizQuestions(@PathVariable Long quizId) {
        quizQuestionService.clearQuizQuestions(quizId);
    }
}