package nsbm.dea.lms.content.dto;

import nsbm.dea.lms.content.entity.enums.ContentType;

import java.util.UUID;

public record ContentResponse(
        UUID id,
        UUID classId,
        ContentType contentType,
        UUID referenceId,
        Integer sequenceOrder,
        Boolean isActive
) {}