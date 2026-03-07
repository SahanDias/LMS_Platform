package nsbm.dea.lms.class_schedule.service;

import lombok.RequiredArgsConstructor;
import nsbm.dea.lms.class_schedule.constant.ClassStatus;
import nsbm.dea.lms.class_schedule.dto.ClassesDTO;
import nsbm.dea.lms.class_schedule.dto.ReorderItemDTO;
import nsbm.dea.lms.class_schedule.dto.ScheduleDTO;
import nsbm.dea.lms.class_schedule.entity.Classes;
import nsbm.dea.lms.class_schedule.exception.ResourceNotFoundException;
import nsbm.dea.lms.class_schedule.repository.ClassesRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClassesService {

    private final ClassesRepository classesRepository;

    public Classes createClass(ClassesDTO dto) {
        Classes classes = new Classes();
        classes.setCourseId(dto.getCourseId());
        classes.setTitle(dto.getTitle());
        classes.setDescription(dto.getDescription());
        classes.setStatus(dto.getStatus());
        classes.setIsFree(dto.getIsFree());
        classes.setPosition(dto.getPosition());
        if (classes.getStatus() == null) {
            classes.setStatus(ClassStatus.DRAFT);
        }
        if (classes.getPosition() == null && classes.getCourseId() != null) {
            int nextPosition = classesRepository
                    .findTopByCourseIdOrderByPositionDesc(classes.getCourseId())
                    .map(existing -> Optional.ofNullable(existing.getPosition()).orElse(0) + 1)
                    .orElse(1);
            classes.setPosition(nextPosition);
        }
        return classesRepository.save(classes);
    }

    public Classes updateClass(UUID classId, ClassesDTO dto) {
        Classes existing = getClassOrThrow(classId);
        if (dto.getCourseId() != null) {
            existing.setCourseId(dto.getCourseId());
        }
        if (dto.getTitle() != null) {
            existing.setTitle(dto.getTitle());
        }
        if (dto.getDescription() != null) {
            existing.setDescription(dto.getDescription());
        }
        if (dto.getStatus() != null) {
            existing.setStatus(dto.getStatus());
        }
        if (dto.getIsFree() != null) {
            existing.setIsFree(dto.getIsFree());
        }
        if (dto.getPosition() != null) {
            existing.setPosition(dto.getPosition());
        }
        return classesRepository.save(existing);
    }

    public void deleteClass(UUID classId) {
        Classes existing = getClassOrThrow(classId);
        classesRepository.delete(existing);
    }

    public List<Classes> getClassesByCourse(Long courseId, ClassStatus status) {
        if (status == null) {
            return classesRepository.findByCourseIdOrderByPositionAsc(courseId);
        }
        return classesRepository.findByCourseIdAndStatusOrderByPositionAsc(courseId, status);
    }

    public ScheduleDTO updateSchedule(UUID classId, ScheduleDTO dto) {
        Classes existing = getClassOrThrow(classId);
        if (dto.getScheduleStartAt() != null) {
            existing.setScheduleStartAt(dto.getScheduleStartAt());
        }
        if (dto.getScheduleEndAt() != null) {
            existing.setScheduleEndAt(dto.getScheduleEndAt());
        }
        if (dto.getScheduleOpen() != null) {
            existing.setScheduleOpen(dto.getScheduleOpen());
        }
        Classes saved = classesRepository.save(existing);
        return toScheduleDTO(saved);
    }

    public ScheduleDTO getSchedule(UUID classId) {
        Classes existing = getClassOrThrow(classId);
        return toScheduleDTO(existing);
    }

    public void reorderClasses(Long courseId, List<ReorderItemDTO> items) {
        if (items == null || items.isEmpty()) {
            return;
        }
        Map<UUID, Integer> positions = items.stream()
                .filter(item -> item.getClassId() != null)
                .collect(Collectors.toMap(ReorderItemDTO::getClassId, ReorderItemDTO::getPosition, (a, b) -> b));
        List<Classes> classesList = classesRepository.findAllById(positions.keySet());
        if (classesList.size() != positions.size()) {
            throw new ResourceNotFoundException("One or more classes not found for reordering.");
        }
        for (Classes classes : classesList) {
            if (!courseId.equals(classes.getCourseId())) {
                throw new ResourceNotFoundException("Class does not belong to course: " + classes.getId());
            }
            classes.setPosition(positions.get(classes.getId()));
        }
        classesRepository.saveAll(classesList);
    }

    public List<Classes> getOrderedStudentClasses(Long courseId) {
        return classesRepository.findByCourseIdAndStatusOrderByPositionAsc(
                courseId,
                ClassStatus.PUBLISHED
        );
    }

    private Classes getClassOrThrow(UUID classId) {
        return classesRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found: " + classId));
    }

    private ScheduleDTO toScheduleDTO(Classes classes) {
        ScheduleDTO dto = new ScheduleDTO();
        dto.setScheduleStartAt(classes.getScheduleStartAt());
        dto.setScheduleEndAt(classes.getScheduleEndAt());
        dto.setScheduleOpen(classes.getScheduleOpen());
        return dto;
    }
}
