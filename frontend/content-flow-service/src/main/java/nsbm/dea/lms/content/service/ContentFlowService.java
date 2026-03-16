package nsbm.dea.lms.content.service;

import lombok.RequiredArgsConstructor;
import nsbm.dea.lms.content.entity.ContentItem;
import nsbm.dea.lms.content.entity.ContentRule;
import nsbm.dea.lms.content.entity.enums.ContentType;
import nsbm.dea.lms.content.repository.ContentItemRepository;
import nsbm.dea.lms.content.repository.ContentRuleRepository;
import nsbm.dea.lms.content.feign.ClassClient;
import nsbm.dea.lms.content.feign.VideoClient;
import nsbm.dea.lms.content.feign.QuizClient;
import nsbm.dea.lms.content.feign.ProgressClient;
import nsbm.dea.lms.content.exception.BadRequestException;
import nsbm.dea.lms.content.exception.ResourceNotFoundException;
import nsbm.dea.lms.content.exception.ServiceUnavailableException;
import nsbm.dea.lms.content.dto.ContentResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ContentFlowService {

    private final ContentItemRepository contentItemRepository;
    private final ContentRuleRepository contentRuleRepository;

    private final ClassClient classClient;
    private final VideoClient videoClient;
    private final QuizClient quizClient;
    private final ProgressClient progressClient;

    // -------------------------------
    // Existing Add Content Logic
    // -------------------------------
    public ContentItem addContent(UUID classId, ContentType type, UUID referenceId) {

        // 1. Verify class exists
        try {
            Object clazz = classClient.getClassById(classId);
            if (clazz == null) {
                throw new ResourceNotFoundException("Class not found");
            }
        } catch (Exception e) {
            throw new ServiceUnavailableException("Class service unavailable");
        }

        // 2. Verify reference exists
        try {
            if (type == ContentType.VIDEO) {
                Object video = videoClient.getVideoById(referenceId);
                if (video == null) {
                    throw new ResourceNotFoundException("Video not found");
                }
            } else if (type == ContentType.QUIZ) {
                Object quiz = quizClient.getQuizById(referenceId);
                if (quiz == null) {
                    throw new ResourceNotFoundException("Quiz not found");
                }
            }
        } catch (Exception e) {
            throw new ServiceUnavailableException("Reference service unavailable");
        }

        // 3. Prevent duplicates
        if (contentItemRepository.existsByClassIdAndReferenceId(classId, referenceId)) {
            throw new BadRequestException("Content already exists in class");
        }

        // 4. Determine next sequence order
        List<ContentItem> items = contentItemRepository.findByClassIdOrderBySequenceOrder(classId);
        int nextOrder = items.isEmpty() ? 1 : items.get(items.size() - 1).getSequenceOrder() + 1;

        // 5. Build and save
        ContentItem item = ContentItem.builder()
                .classId(classId)
                .contentType(type)
                .referenceId(referenceId)
                .sequenceOrder(nextOrder)
                .isActive(true)
                .build();

        return contentItemRepository.save(item);
    }

    @Transactional
    public void reorder(UUID classId, List<UUID> orderedIds) {
        List<ContentItem> items = contentItemRepository.findByClassIdOrderBySequenceOrder(classId);

        for (int i = 0; i < orderedIds.size(); i++) {
            UUID id = orderedIds.get(i);
            for (ContentItem item : items) {
                if (item.getId().equals(id)) {
                    item.setSequenceOrder(i + 1);
                    contentItemRepository.save(item);
                }
            }
        }
    }

    public boolean checkCompletion(UUID studentId, UUID contentId) {
        try {
            return progressClient.isCompleted(studentId, contentId);
        } catch (Exception e) {
            throw new ServiceUnavailableException("Progress service unavailable");
        }
    }

    // -------------------------------
    // 📊 PHASE 3 — Unlock Rule Engine
    // -------------------------------
    public List<ContentResponse> getUnlockedContent(UUID classId, UUID studentId) {
        List<ContentItem> items =
                contentItemRepository.findByClassIdOrderBySequenceOrder(classId);

        List<ContentResponse> responseList = new ArrayList<>();

        for (ContentItem item : items) {
            if (!item.getIsActive()) continue;

            boolean unlocked = checkUnlock(item, studentId);

            responseList.add(
                    new ContentResponse(
                            item.getId(),
                            item.getClassId(),
                            item.getContentType(),
                            item.getReferenceId(),
                            item.getSequenceOrder(),
                            unlocked
                    )
            );
        }

        return responseList;
    }

    private boolean checkUnlock(ContentItem item, UUID studentId) {
        List<ContentRule> rules =
                contentRuleRepository.findByContentItemId(item.getId());

        if (rules.isEmpty()) return true;

        for (ContentRule rule : rules) {
            Boolean completed =
                    progressClient.isCompleted(studentId, rule.getRequiredCompletionOf());

            if (!completed) {
                return false;
            }
        }

        return true;
    }
}
