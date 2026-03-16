package nsbm.dea.lms.progress_service.controller;

import nsbm.dea.lms.progress_service.dto.QuestionDTO;
import nsbm.dea.lms.progress_service.entity.Question;
import nsbm.dea.lms.progress_service.service.QuectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/question")
public class QuestionController {

    @Autowired
    private QuectionService quectionService;

    @GetMapping("/get/all")
    public List<Question> getAllQuestions() {
        return quectionService.getAllQuestions();
    }

    @PostMapping("/save")
    public String saveQuestion(@RequestBody QuestionDTO questionDTO) {
        return quectionService.addQuestion(questionDTO);
    }

    @PutMapping("/update")
    public String updateQuestion(@RequestBody QuestionDTO questionDTO) {
        return quectionService.updateQuestion(questionDTO);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteQuestion(@PathVariable Long id) {
        return quectionService.deleteQuestion(id);
    }

    @GetMapping("/get/{id}")
    public Question getQuestion(@PathVariable Long id) {
        Optional<Question> question = quectionService.getQuestionById(id);
        return question.orElseThrow(() -> new RuntimeException("Question not found with id: " + id));
    }
}