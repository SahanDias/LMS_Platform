package nsbm.dea.lms.quiz_service.repository;

import nsbm.dea.lms.quiz_service.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/*
  Handles database operations for Quiz
*/

public interface QuizRepository extends JpaRepository<Quiz, Long> {

     // Find quizzes by Course ID

    List<Quiz> findByCourseId(Long courseId);

     // Find quizzes by Class ID

    List<Quiz> findByClassId(Long classId);
}