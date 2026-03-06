package nsbm.dea.lms.content.controller;

import nsbm.dea.lms.content.dto.CreateContentRequest;
import nsbm.dea.lms.content.dto.ContentResponse;
import nsbm.dea.lms.content.dto.ReorderRequest;
import nsbm.dea.lms.content.service.ContentFlowService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/content")
@RequiredArgsConstructor
public class ContentFlowController {

    private final ContentFlowService contentFlowService;

    @PostMapping
    public ResponseEntity<ContentResponse> addContent(
            @Valid @RequestBody CreateContentRequest request) {

        var item = contentFlowService.addContent(
                request.classId(),
                request.contentType(),
                request.referenceId()
        );

        return ResponseEntity.ok(
                new ContentResponse(
                        item.getId(),
                        item.getClassId(),
                        item.getContentType(),
                        item.getReferenceId(),
                        item.getSequenceOrder(),
                        item.getIsActive()
                )
        );
    }

    @PutMapping("/{classId}/reorder")
    public ResponseEntity<?> reorder(
            @PathVariable UUID classId,
            @Valid @RequestBody ReorderRequest request) {

        contentFlowService.reorder(classId, request.orderedIds());

        return ResponseEntity.ok("Reordered successfully");
    }

    // 📊 Student View Endpoint — Unlock Rule Engine
    @GetMapping("/student/{classId}/{studentId}")
    public ResponseEntity<List<ContentResponse>> getStudentContent(
            @PathVariable UUID classId,
            @PathVariable UUID studentId) {

        return ResponseEntity.ok(
                contentFlowService.getUnlockedContent(classId, studentId)
        );
    }
}
