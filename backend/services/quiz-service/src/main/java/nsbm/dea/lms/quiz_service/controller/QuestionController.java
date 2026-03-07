package nsbm.dea.lms.quiz_service.controller;

import nsbm.dea.lms.quiz_service.dto.CreateQuestionRequest;
import nsbm.dea.lms.quiz_service.entity.Question;
import nsbm.dea.lms.quiz_service.service.QuestionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/*
    Admin Question Bank APIs
  Base URL      : /api/admin/questions
*/

@RestController
@RequestMapping("/api/admin/questions")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class QuestionController {

    // DEPENDENCY
    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    // CREATE QUESTION
    @PostMapping
    public Question createQuestion(@RequestBody CreateQuestionRequest request) {
        return questionService.createQuestion(request);
    }

    // GET QUESTIONS
    @GetMapping
    public List<Question> getQuestions(
            @RequestParam(required = false) Long courseId,
            @RequestParam(required = false) Long classId
    ) {
        return questionService.getQuestions(courseId, classId);
    }

    // GET BY ID
    @GetMapping("/{questionId}")
    public Question getQuestionById(@PathVariable Long questionId) {
        return questionService.getQuestionById(questionId);
    }

    // DELETE QUESTION
    @DeleteMapping("/{questionId}")
    public void deleteQuestion(@PathVariable Long questionId) {
        questionService.deleteQuestion(questionId);
    }
}