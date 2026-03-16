package nsbm.dea.lms.enrollment.service;

import nsbm.dea.lms.enrollment.dto.EnrollmentDTO;
import nsbm.dea.lms.enrollment.entity.Enrollment;
import nsbm.dea.lms.enrollment.entity.WaitlistEntry;
import nsbm.dea.lms.enrollment.entity.enums.EnrollmentStatus;
import nsbm.dea.lms.enrollment.exception.EnrollmentExceptions;
import nsbm.dea.lms.enrollment.mapper.EnrollmentMapper;
import nsbm.dea.lms.enrollment.repository.EnrollmentRepository;
import nsbm.dea.lms.enrollment.repository.WaitlistRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpClientErrorException;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.EnumSet;
import java.util.List;
import java.util.Optional;

@Service
public class EnrollmentService {

    private static final EnumSet<EnrollmentStatus> ACTIVE_STATUSES = EnumSet.of(EnrollmentStatus.PENDING, EnrollmentStatus.ACTIVE);
    private static final DateTimeFormatter ISO = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    private final EnrollmentRepository enrollmentRepository;
    private final WaitlistRepository waitlistRepository;
    private final EnrollmentMapper enrollmentMapper;
    private final WaitlistService waitlistService;
    private final ExternalApi externalApi;

    public EnrollmentService(EnrollmentRepository enrollmentRepository,
                             WaitlistRepository waitlistRepository,
                             EnrollmentMapper enrollmentMapper,
                             WaitlistService waitlistService,
                             ExternalApi externalApi) {
        this.enrollmentRepository = enrollmentRepository;
        this.waitlistRepository = waitlistRepository;
        this.enrollmentMapper = enrollmentMapper;
        this.waitlistService = waitlistService;
        this.externalApi = externalApi;
    }

    // ─── Enrollment CRUD ───────────────────────────────────────────────────

    @Transactional
    public EnrollmentDTO createEnrollment(EnrollmentDTO.CreateEnrollmentRequest request) {
        if (externalApi.getCourseById(request.getCourseId()).isEmpty()) {
            throw new IllegalArgumentException("Course does not exist: " + request.getCourseId());
        }
        String courseUuid = String.valueOf(request.getCourseId());
        if (!externalApi.hasCapacity(request.getClassId(), courseUuid)) {
            WaitlistEntry entry = WaitlistEntry.builder()
                    .studentId(request.getStudentId())
                    .courseId(request.getCourseId())
                    .classId(request.getClassId())
                    .holdPaymentStatus(Boolean.TRUE)
                    .build();
            waitlistService.createWaitlistEntry(entry);
            throw new EnrollmentExceptions.ClassFull(request.getClassId());
        }

        Enrollment enrollment = Enrollment.builder()
                .studentId(request.getStudentId())
                .courseId(request.getCourseId())
                .classId(request.getClassId())
                .paymentId(request.getPaymentId())
                .status(EnrollmentStatus.PENDING)
                .enrollmentDate(LocalDateTime.now())
                .deadlineDate(request.getDeadlineDate())
                .build();
        if (externalApi.isPaymentConfirmed(request.getPaymentId())) {
            enrollment.setStatus(EnrollmentStatus.ACTIVE);
        }
        return enrollmentMapper.toDto(enrollmentRepository.save(enrollment));
    }

    @Transactional
    public Page<EnrollmentDTO> bulkEnrollStudents(EnrollmentDTO.BulkEnrollmentRequest request, Pageable pageable) {
        List<EnrollmentDTO> created = new ArrayList<>();
        for (EnrollmentDTO.CreateEnrollmentRequest item : request.getEnrollments()) {
            try {
                created.add(createEnrollment(item));
            } catch (RuntimeException ignored) {}
        }
        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), created.size());
        List<EnrollmentDTO> content = start >= end ? List.of() : created.subList(start, end);
        return new PageImpl<>(content, pageable, created.size());
    }

    @Transactional(readOnly = true)
    public EnrollmentDTO getEnrollmentById(Long id) {
        Enrollment e = enrollmentRepository.findById(id).orElseThrow(() -> new EnrollmentExceptions.NotFound(id));
        return enrollmentMapper.toDto(e);
    }

    @Transactional(readOnly = true)
    public Page<EnrollmentDTO> getEnrollmentsByStudent(Long studentId, Pageable pageable) {
        return enrollmentRepository.findByStudentId(studentId, pageable).map(enrollmentMapper::toDto);
    }

    @Transactional(readOnly = true)
    public Page<EnrollmentDTO> getEnrollmentsByCourse(Long courseId, Pageable pageable) {
        return enrollmentRepository.findByCourseId(courseId, pageable).map(enrollmentMapper::toDto);
    }

    @Transactional
    public EnrollmentDTO updateEnrollmentStatus(Long id, EnrollmentDTO.UpdateEnrollmentStatusRequest request) {
        Enrollment e = enrollmentRepository.findById(id).orElseThrow(() -> new EnrollmentExceptions.NotFound(id));
        validateTransition(e.getStatus(), request.getStatus(), id);
        e.setStatus(request.getStatus());
        return enrollmentMapper.toDto(enrollmentRepository.save(e));
    }

    @Transactional
    public EnrollmentDTO transferEnrollment(Long id, EnrollmentDTO.TransferClassRequest request) {
        Enrollment e = enrollmentRepository.findById(id).orElseThrow(() -> new EnrollmentExceptions.NotFound(id));
        if (!ACTIVE_STATUSES.contains(e.getStatus())) {
            throw new EnrollmentExceptions.InvalidState("Only PENDING or ACTIVE enrollments can be transferred. Enrollment id: " + id);
        }
        String courseUuid = String.valueOf(e.getCourseId());
        if (!externalApi.hasCapacity(request.getTargetClassId(), courseUuid)) {
            throw new EnrollmentExceptions.ClassFull(request.getTargetClassId());
        }
        e.setClassId(request.getTargetClassId());
        return enrollmentMapper.toDto(enrollmentRepository.save(e));
    }

    @Transactional
    public EnrollmentDTO extendEnrollmentDeadline(Long id, EnrollmentDTO.ExtendDeadlineRequest request) {
        Enrollment e = enrollmentRepository.findById(id).orElseThrow(() -> new EnrollmentExceptions.NotFound(id));
        e.setDeadlineDate(request.getNewDeadlineDate());
        return enrollmentMapper.toDto(enrollmentRepository.save(e));
    }

    @Transactional
    public void cancelEnrollment(Long id) {
        Enrollment e = enrollmentRepository.findById(id).orElseThrow(() -> new EnrollmentExceptions.NotFound(id));
        e.setStatus(EnrollmentStatus.CANCELLED);
        enrollmentRepository.save(e);
    }

    private void validateTransition(EnrollmentStatus current, EnrollmentStatus target, Long id) {
        if (current == EnrollmentStatus.PENDING && target == EnrollmentStatus.ACTIVE) return;
        if (current == EnrollmentStatus.ACTIVE && (target == EnrollmentStatus.COMPLETED || target == EnrollmentStatus.DROPPED || target == EnrollmentStatus.SUSPENDED)) return;
        throw new EnrollmentExceptions.InvalidState("Invalid status transition from " + current + " to " + target + " for enrollment id " + id);
    }

    // ─── Catalog (course + classes from external APIs) ──────────────────────

    public List<EnrollmentDTO.CourseResponse> getCoursesForCatalog() {
        List<EnrollmentDTO.CourseDTO> list = externalApi.getCourses();
        return list.stream().map(this::toCourseResponse).toList();
    }

    public Optional<EnrollmentDTO.CourseResponse> getCourseByIdForCatalog(Long courseId) {
        return externalApi.getCourseById(courseId).map(this::toCourseResponse);
    }

    public List<EnrollmentDTO.ClassResponse> getClassesByCourseForCatalog(Long courseId) {
        return externalApi.getClassesByCourse(String.valueOf(courseId));
    }

    private EnrollmentDTO.CourseResponse toCourseResponse(EnrollmentDTO.CourseDTO dto) {
        EnrollmentDTO.CourseResponse r = new EnrollmentDTO.CourseResponse();
        r.setId(dto.getId());
        r.setTitle(dto.getTitle());
        r.setDescription(dto.getDescription());
        r.setThumbnailImgUrl(dto.getThumbnailImgUrl());
        r.setPrice(dto.getPrice());
        r.setPassingPercentage(dto.getPassingPercentage());
        r.setCertificationEnabled(dto.isCertificationEnabled());
        r.setStatus(dto.getStatus());
        r.setCreatedBy(dto.getCreatedBy());
        r.setCreatedAt(dto.getCreatedAt() != null ? dto.getCreatedAt().format(ISO) : null);
        r.setUpdatedAt(dto.getUpdatedAt() != null ? dto.getUpdatedAt().format(ISO) : null);
        r.setUuid(dto.getId() != null ? String.valueOf(dto.getId()) : null);
        return r;
    }

    // ─── Course proxy (forward to course service) ───────────────────────────

    public List<EnrollmentDTO.CourseDTO> getCourses() {
        return externalApi.getCourses();
    }

    public Optional<EnrollmentDTO.CourseDTO> getCourseById(Long id) {
        return externalApi.getCourseById(id);
    }

    public EnrollmentDTO.CourseDTO createCourse(EnrollmentDTO.CourseDTO dto) {
        return externalApi.createCourse(dto);
    }

    public EnrollmentDTO.CourseDTO updateCourse(Long id, EnrollmentDTO.CourseDTO dto) {
        try {
            return externalApi.updateCourse(id, dto);
        } catch (HttpClientErrorException ex) {
            if (ex.getStatusCode() == HttpStatusCode.valueOf(404)) throw new EnrollmentExceptions.CourseNotFound(id);
            throw ex;
        }
    }

    public void deleteCourse(Long id) {
        try {
            externalApi.deleteCourse(id);
        } catch (HttpClientErrorException ex) {
            if (ex.getStatusCode() == HttpStatusCode.valueOf(404)) throw new EnrollmentExceptions.CourseNotFound(id);
            throw ex;
        }
    }
}
