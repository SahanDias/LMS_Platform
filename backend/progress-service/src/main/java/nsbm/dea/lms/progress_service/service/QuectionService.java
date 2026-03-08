package nsbm.dea.lms.progress_service.service;

import nsbm.dea.lms.progress_service.dto.QuestionDTO;
import nsbm.dea.lms.progress_service.entity.Question;

import java.util.List;
import java.util.Optional;

public interface QuectionService {

    List<Question> getAllQuestions();
    String addQuestion(QuestionDTO questionDTO);
    String updateQuestion(QuestionDTO questionDTO);
    String deleteQuestion(Long id);
    Optional<Question> getQuestionById(Long id);
}
