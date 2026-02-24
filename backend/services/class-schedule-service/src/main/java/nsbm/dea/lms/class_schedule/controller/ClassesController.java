package nsbm.dea.lms.class_schedule.controller;

import lombok.RequiredArgsConstructor;
import nsbm.dea.lms.class_schedule.constant.ClassStatus;
import nsbm.dea.lms.class_schedule.dto.ClassesDTO;
import nsbm.dea.lms.class_schedule.dto.ReorderItemDTO;
import nsbm.dea.lms.class_schedule.dto.ScheduleDTO;
import nsbm.dea.lms.class_schedule.entity.Classes;
import nsbm.dea.lms.class_schedule.service.ClassesService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class ClassesController {
    private final ClassesService classesService;

    @PostMapping("/classes/create-class")
    public ResponseEntity<Classes> createClass(@RequestBody ClassesDTO dto) {
        if (dto.getCourseId() == null) {
            throw new IllegalArgumentException("courseId is required in request body.");
        }
        return new ResponseEntity<>(
                classesService.createClass(dto),
                HttpStatus.CREATED
        );
    }

    @PutMapping("/classes/{classId}")
    public ResponseEntity<Classes> updateClass(
            @PathVariable("classId") UUID classId,
            @RequestBody ClassesDTO dto
    ) {
        return ResponseEntity.ok(classesService.updateClass(classId, dto));
    }

    @DeleteMapping("/classes/{classId}")
    public ResponseEntity<Void> deleteClass(@PathVariable("classId") UUID classId) {
        classesService.deleteClass(classId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/courses/{courseId}/classes")
    public ResponseEntity<List<Classes>> getClassesByCourse(
            @PathVariable("courseId") UUID courseId,
            @RequestParam(value = "status", required = false) ClassStatus status
    ) {
        return ResponseEntity.ok(classesService.getClassesByCourse(courseId, status));
    }

    @PutMapping("/classes/{classId}/schedule")
    public ResponseEntity<ScheduleDTO> updateSchedule(
            @PathVariable("classId") UUID classId,
            @RequestBody ScheduleDTO dto
    ) {
        return ResponseEntity.ok(classesService.updateSchedule(classId, dto));
    }

    @GetMapping("/classes/{classId}/schedule")
    public ResponseEntity<ScheduleDTO> getSchedule(@PathVariable("classId") UUID classId) {
        return ResponseEntity.ok(classesService.getSchedule(classId));
    }

    @PutMapping("/courses/{courseId}/classes/reorder")
    public ResponseEntity<Void> reorderClasses(
            @PathVariable("courseId") UUID courseId,
            @RequestBody List<ReorderItemDTO> items
    ) {
        classesService.reorderClasses(courseId, items);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/courses/{courseId}/classes/ordered")
    public ResponseEntity<List<Classes>> getOrderedClasses(@PathVariable("courseId") UUID courseId) {
        return ResponseEntity.ok(classesService.getOrderedStudentClasses(courseId));
    }
}
