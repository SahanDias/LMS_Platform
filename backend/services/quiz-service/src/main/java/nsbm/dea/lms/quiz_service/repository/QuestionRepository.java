package nsbm.dea.lms.quiz_service.repository;

import nsbm.dea.lms.quiz_service.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/*
 Handles Question Bank operations
*/

public interface QuestionRepository extends JpaRepository<Question, Long> {


    // Get all questions under a Course

    List<Question> findByCourseId(Long courseId);

    // Get all questions under a Class

    List<Question> findByClassId(Long classId);
}