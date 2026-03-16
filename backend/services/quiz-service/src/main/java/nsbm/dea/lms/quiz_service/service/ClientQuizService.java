package nsbm.dea.lms.quiz_service.service;

import nsbm.dea.lms.quiz_service.dto.QuizSummaryResponse;
import nsbm.dea.lms.quiz_service.dto.StartQuizResponse;
import nsbm.dea.lms.quiz_service.dto.SubmitQuizRequest;
import nsbm.dea.lms.quiz_service.dto.SubmitQuizResponse;

import java.util.List;

/*
  This service contains student-side operations.
  Student side requirements:
  1) Student sees ACTIVE quizzes under a class
  2) Student starts a quiz and loads questions + answers
     (IMPORTANT: Do NOT send correct answers to student)
  3) Student submits quiz attempt (calculate score + pass/fail)
*/

public interface ClientQuizService {

    // List ACTIVE quizzes for a class (student view)
    List<QuizSummaryResponse> getActiveQuizzesByClassId(Long classId);

    // Start quiz (student clicks "Attempt Quiz")
    StartQuizResponse startQuiz(Long quizId);

    SubmitQuizResponse submitQuiz(Long quizId, SubmitQuizRequest request);
}