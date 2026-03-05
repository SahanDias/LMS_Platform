package progress.service.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import progress.service.entity.Quiz;

public interface QuizRepo extends JpaRepository<Quiz ,Integer> {
}
