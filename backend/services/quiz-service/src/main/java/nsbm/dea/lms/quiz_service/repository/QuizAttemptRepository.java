package nsbm.dea.lms.quiz_service.repository;

import nsbm.dea.lms.quiz_service.entity.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {

    List<QuizAttempt> findByQuizIdAndStudentId(Long quizId, Long studentId);

    long countByQuizIdAndStudentId(Long quizId, Long studentId);
}