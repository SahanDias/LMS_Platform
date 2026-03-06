package nsbm.dea.lms.content.repository;

import nsbm.dea.lms.content.entity.ContentItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ContentItemRepository extends JpaRepository<ContentItem, UUID> {

    List<ContentItem> findByClassIdOrderBySequenceOrder(UUID classId);

    boolean existsByClassIdAndReferenceId(UUID classId, UUID referenceId);
}