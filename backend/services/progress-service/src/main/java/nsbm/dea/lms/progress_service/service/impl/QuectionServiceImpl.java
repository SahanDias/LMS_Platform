package nsbm.dea.lms.progress_service.service.impl;

import nsbm.dea.lms.progress_service.entity.Question;
import nsbm.dea.lms.progress_service.repository.QuestionRepo;
import nsbm.dea.lms.progress_service.service.QuectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
@Service
public class QuectionServiceImpl implements QuectionService {
    @Autowired
    QuestionRepo questionRepo ;
    @Override
    public List<Question> getAllQuection() {
        List<Question> all = questionRepo.findAll();
        return all ;
    }
}
