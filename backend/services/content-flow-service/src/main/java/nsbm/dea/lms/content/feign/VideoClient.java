package nsbm.dea.lms.content.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.UUID;

@FeignClient(name = "video-service", url = "http://localhost:8084")
public interface VideoClient {

    @GetMapping("/api/videos/{id}")
    Object getVideoById(@PathVariable UUID id);
}