package nsbm.dea.lms.content.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.UUID;

@FeignClient(name = "progress-service", url = "http://localhost:8086")
public interface ProgressClient {

    @GetMapping("/api/progress/{studentId}/completed/{contentId}")
    Boolean isCompleted(
            @PathVariable UUID studentId,
            @PathVariable UUID contentId
    );
}