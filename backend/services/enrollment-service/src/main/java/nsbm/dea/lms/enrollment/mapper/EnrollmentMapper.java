package nsbm.dea.lms.enrollment.mapper;

import nsbm.dea.lms.enrollment.dto.EnrollmentDTO;
import nsbm.dea.lms.enrollment.entity.Enrollment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface EnrollmentMapper {

    EnrollmentDTO toDto(Enrollment enrollment);

    @Mapping(target = "id", ignore = true)
    Enrollment toEntity(EnrollmentDTO dto);
}

