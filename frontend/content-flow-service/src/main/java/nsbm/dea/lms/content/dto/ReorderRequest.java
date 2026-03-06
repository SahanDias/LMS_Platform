package nsbm.dea.lms.content.dto;

import jakarta.validation.constraints.NotEmpty;

import java.util.List;
import java.util.UUID;

public record ReorderRequest(

        @NotEmpty(message = "Ordered list cannot be empty")
        List<UUID> orderedIds

) {}