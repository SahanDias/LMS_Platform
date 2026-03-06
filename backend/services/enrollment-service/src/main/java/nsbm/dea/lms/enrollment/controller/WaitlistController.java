package nsbm.dea.lms.enrollment.controller;

import nsbm.dea.lms.enrollment.dto.WaitlistDTO;
import nsbm.dea.lms.enrollment.entity.WaitlistEntry;
import nsbm.dea.lms.enrollment.service.WaitlistService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/waitlist")
@RequiredArgsConstructor
public class WaitlistController {

    private final WaitlistService waitlistService;

    @PostMapping
    public ResponseEntity<WaitlistDTO> createWaitlistEntry(@Valid @RequestBody WaitlistDTO.CreateWaitlistRequest request) {
        WaitlistEntry entry = WaitlistEntry.builder()
                .studentId(request.getStudentId())
                .courseId(request.getCourseId())
                .classId(request.getClassId())
                .holdPaymentStatus(request.getHoldPaymentStatus())
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(waitlistService.createWaitlistEntry(entry));
    }

    @GetMapping("/{studentId}")
    public ResponseEntity<List<WaitlistDTO>> getWaitlistByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(waitlistService.getWaitlistByStudent(studentId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeFromWaitlist(@PathVariable Long id) {
        waitlistService.removeFromWaitlist(id);
        return ResponseEntity.noContent().build();
    }
}
