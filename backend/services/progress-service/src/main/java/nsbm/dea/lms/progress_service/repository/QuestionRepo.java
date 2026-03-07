package nsbm.dea.lms.progress_service.repository;

import nsbm.dea.lms.progress_service.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;



public interface QuestionRepo extends JpaRepository<Question, Long> {

}