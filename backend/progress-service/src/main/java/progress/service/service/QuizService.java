package progress.service.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import progress.service.entity.Quiz;
import progress.service.repo.QuizRepo;

import java.util.List;

@Transactional
@Service
public class QuizService {

    @Autowired
    QuizRepo quizRepo;

    public List<Quiz> getAllQuiz() {
        java.util.List<Quiz> all = quizRepo.findAll();
        return all;
    }
}
