package nsbm.dea.lms.enrollment.mapper;

import nsbm.dea.lms.enrollment.dto.WaitlistDTO;
import nsbm.dea.lms.enrollment.entity.WaitlistEntry;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface WaitlistMapper {

    WaitlistDTO toDto(WaitlistEntry entry);
}

