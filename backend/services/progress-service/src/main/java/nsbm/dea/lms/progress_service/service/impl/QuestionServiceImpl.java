package nsbm.dea.lms.progress_service.service.impl;

import nsbm.dea.lms.progress_service.dto.QuestionDTO;
import nsbm.dea.lms.progress_service.entity.Question;
import nsbm.dea.lms.progress_service.repository.QuestionRepo;
import nsbm.dea.lms.progress_service.service.QuectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Transactional
@Service
public class QuestionServiceImpl implements QuectionService {

    @Autowired
    private QuestionRepo questionRepo;

    @Override
    public List<Question> getAllQuestions() {
        return questionRepo.findAll();
    }

    @Override
    public String addQuestion(QuestionDTO questionDTO) {
        Question question = new Question();
        question.setQuestionText(questionDTO.getQuestionText());
        question.setClassId(questionDTO.getClassId());
        question.setCourseId(questionDTO.getCourseId());
        questionRepo.save(question);
        return "Question added successfully";
    }

    @Override
    public String updateQuestion(QuestionDTO questionDTO) {
        Optional<Question> optionalQuestion = questionRepo.findById(questionDTO.getQuestionId());
        if (optionalQuestion.isPresent()) {
            Question question = optionalQuestion.get();
            question.setQuestionText(questionDTO.getQuestionText());
            question.setClassId(questionDTO.getClassId());
            question.setCourseId(questionDTO.getCourseId());
            questionRepo.save(question);
            return "Question updated successfully";
        } else {
            return "Question not found";
        }
    }

    @Override
    public String deleteQuestion(Long id) {
        if (questionRepo.existsById(id)) {
            questionRepo.deleteById(id);
            return "Question deleted successfully";
        } else {
            return "Question not found";
        }
    }

    @Override
    public Optional<Question> getQuestionById(Long id) {
        return questionRepo.findById(id);
    }
}