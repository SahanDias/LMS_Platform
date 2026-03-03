package nsbm.dea.lms.quiz_service.repository;

import nsbm.dea.lms.quiz_service.entity.QuizQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/*
  Stores mapping between Quiz and Question
*/

public interface QuizQuestionRepository extends JpaRepository<QuizQuestion, Long> {

     // Get selected questions for a Quiz

    List<QuizQuestion> findByQuizId(Long quizId);

     // Delete all question mappings of a Quiz

    void deleteByQuizId(Long quizId);
}