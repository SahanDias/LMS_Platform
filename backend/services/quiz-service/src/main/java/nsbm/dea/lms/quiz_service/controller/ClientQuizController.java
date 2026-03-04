package nsbm.dea.lms.quiz_service.controller;

import nsbm.dea.lms.quiz_service.dto.QuizSummaryResponse;
import nsbm.dea.lms.quiz_service.dto.StartQuizResponse;
import nsbm.dea.lms.quiz_service.dto.SubmitQuizRequest;
import nsbm.dea.lms.quiz_service.dto.SubmitQuizResponse;
import nsbm.dea.lms.quiz_service.service.ClientQuizService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/*
  Student can:
  1) See available ACTIVE quizzes under a class
  2) Start a quiz and view questions + answers
  3) Submit quiz attempt and get result
*/

@RestController
@RequestMapping("/api/client/quizzes")
@CrossOrigin(origins = "http://localhost:5173") // React dev server
public class ClientQuizController {

    private final ClientQuizService clientQuizService;

    // Constructor injection
    public ClientQuizController(ClientQuizService clientQuizService) {
        this.clientQuizService = clientQuizService;
    }

    /*
      Student sees active quizzes for a class
      Example:
      GET http://localhost:8085/api/client/quizzes/class/1
    */

    @GetMapping("/class/{classId}")
    public List<QuizSummaryResponse> getActiveQuizzesByClassId(@PathVariable Long classId) {
        return clientQuizService.getActiveQuizzesByClassId(classId);
    }

    /*
       Student starts a quiz (Attempt Quiz)
      Example:
      GET http://localhost:8085/api/client/quizzes/5/start
    */

    @GetMapping("/{quizId}/start")
    public StartQuizResponse startQuiz(@PathVariable Long quizId) {
        return clientQuizService.startQuiz(quizId);
    }

    /*
     POST http://localhost:8085/api/client/quizzes/{quizId}/submit
     SubmitQuizRequest JSON
   */

    @PostMapping("/{quizId}/submit")
    public SubmitQuizResponse submitQuiz(@PathVariable Long quizId,
                                         @RequestBody SubmitQuizRequest request) {
        return clientQuizService.submitQuiz(quizId, request);
    }
}