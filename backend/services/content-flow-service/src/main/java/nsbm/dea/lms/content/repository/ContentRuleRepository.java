package nsbm.dea.lms.content.repository;

import nsbm.dea.lms.content.entity.ContentRule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ContentRuleRepository extends JpaRepository<ContentRule, UUID> {

    List<ContentRule> findByContentItemId(UUID contentItemId);
}