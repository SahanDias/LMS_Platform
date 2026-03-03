package nsbm.dea.lms.quiz_service.repository;

import nsbm.dea.lms.quiz_service.entity.Answer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/*
  Handles Answer table operations
*/

public interface AnswerRepository extends JpaRepository<Answer, Long> {

     // Get answers by Question ID

    List<Answer> findByQuestionQuestionId(Long questionId);
}