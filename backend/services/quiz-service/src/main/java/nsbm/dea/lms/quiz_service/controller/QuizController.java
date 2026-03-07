package nsbm.dea.lms.quiz_service.controller;

import nsbm.dea.lms.quiz_service.dto.CreateQuizRequest;
import nsbm.dea.lms.quiz_service.entity.Quiz;
import nsbm.dea.lms.quiz_service.entity.QuizStatus;
import nsbm.dea.lms.quiz_service.service.QuizService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/*
  Admin Quiz Management APIs
  Base URL      : /api/admin/quizzes
*/

@RestController
@RequestMapping("/api/admin/quizzes")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class QuizController {

    // DEPENDENCY
    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    // CREATE QUIZ
    @PostMapping
    public Quiz createQuiz(@RequestBody CreateQuizRequest request) {
        return quizService.createQuiz(request);
    }

    // GET QUIZZES
    @GetMapping
    public List<Quiz> getAllQuizzes(
            @RequestParam(required = false) Long courseId,
            @RequestParam(required = false) Long classId
    ) {
        return quizService.getAllQuizzes(courseId, classId);
    }

    // GET QUIZ BY ID
    @GetMapping("/{quizId}")
    public Quiz getQuizById(@PathVariable Long quizId) {
        return quizService.getQuizById(quizId);
    }

    // UPDATE QUIZ
    @PutMapping("/{quizId}")
    public Quiz updateQuiz(@PathVariable Long quizId,
                           @RequestBody CreateQuizRequest request) {
        return quizService.updateQuiz(quizId, request);
    }

    // UPDATE STATUS
    @PatchMapping("/{quizId}/status")
    public Quiz updateQuizStatus(@PathVariable Long quizId,
                                 @RequestParam QuizStatus status) {
        return quizService.updateStatus(quizId, status);
    }

    // DELETE QUIZ
    @DeleteMapping("/{quizId}")
    public void deleteQuiz(@PathVariable Long quizId) {
        quizService.deleteQuiz(quizId);
    }
}