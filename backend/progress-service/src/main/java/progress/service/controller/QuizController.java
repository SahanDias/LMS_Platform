package progress.service.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import progress.service.entity.Quiz;
import progress.service.service.QuizService;

import java.util.List;

@RestController
@RequestMapping("/progress/v1/quiz")
public class QuizController {
    @Autowired
    QuizService quizService;

    @GetMapping("/all")
    public List<Quiz> getAll() {
        try {
            List<Quiz> getAllData = quizService.getAllQuiz();
            return getAllData;

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
