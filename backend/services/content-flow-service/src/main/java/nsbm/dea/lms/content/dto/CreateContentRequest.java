package nsbm.dea.lms.content.dto;

import jakarta.validation.constraints.NotNull;
import nsbm.dea.lms.content.entity.enums.ContentType;

import java.util.UUID;

public record CreateContentRequest(

        @NotNull(message = "Class ID is required")
        UUID classId,

        @NotNull(message = "Content type is required")
        ContentType contentType,

        @NotNull(message = "Reference ID is required")
        UUID referenceId

) {}