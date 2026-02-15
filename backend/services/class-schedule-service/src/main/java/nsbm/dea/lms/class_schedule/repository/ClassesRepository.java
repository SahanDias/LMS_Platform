package nsbm.dea.lms.class_schedule.repository;

import nsbm.dea.lms.class_schedule.entity.Classes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ClassesRepository extends JpaRepository <Classes, UUID> {
}
