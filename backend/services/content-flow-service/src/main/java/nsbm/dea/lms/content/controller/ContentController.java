package nsbm.dea.lms.content.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import nsbm.dea.lms.content.dto.CreateContentRequest;
import nsbm.dea.lms.content.dto.ContentResponse;
import nsbm.dea.lms.content.dto.ReorderRequest;
import nsbm.dea.lms.content.entity.ContentItem;
import nsbm.dea.lms.content.service.ContentFlowService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/content")
@RequiredArgsConstructor
public class ContentController {

    private final ContentFlowService contentFlowService;

    // ✅ Add new content
    @PostMapping
    public ResponseEntity<ContentResponse> addContent(
            @Valid @RequestBody CreateContentRequest request) {

        ContentItem item = contentFlowService.addContent(
                request.classId(),
                request.contentType(),
                request.referenceId()
        );

        return ResponseEntity.ok(mapToResponse(item));
    }

    // ✅ Reorder content items
    @PutMapping("/{classId}/reorder")
    public ResponseEntity<Void> reorderContent(
            @PathVariable UUID classId,
            @Valid @RequestBody ReorderRequest request) {

        contentFlowService.reorder(classId, request.orderedIds());
        return ResponseEntity.noContent().build();
    }

    // ✅ Check completion status
    @GetMapping("/{studentId}/completed/{contentId}")
    public ResponseEntity<Boolean> checkCompletion(
            @PathVariable UUID studentId,
            @PathVariable UUID contentId) {

        boolean completed = contentFlowService.checkCompletion(studentId, contentId);
        return ResponseEntity.ok(completed);
    }

    // 🔹 Helper method to map entity → DTO
    private ContentResponse mapToResponse(ContentItem item) {
        return new ContentResponse(
                item.getId(),
                item.getClassId(),
                item.getContentType(),
                item.getReferenceId(),
                item.getSequenceOrder(),
                item.getIsActive()   // ✅ use Lombok-generated getter
        );
    }

    // ✅ Student endpoint
    @GetMapping("/student/{classId}/{studentId}")
    public ResponseEntity<List<ContentResponse>> getStudentContent(
            @PathVariable UUID classId,
            @PathVariable UUID studentId) {

        return ResponseEntity.ok(
                contentFlowService.getUnlockedContent(classId, studentId)
        );
    }

}
