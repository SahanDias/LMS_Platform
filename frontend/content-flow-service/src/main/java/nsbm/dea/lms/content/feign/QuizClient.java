package nsbm.dea.lms.content.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.UUID;

@FeignClient(name = "quiz-service", url = "http://localhost:8085")
public interface QuizClient {

    @GetMapping("/api/quizzes/{id}")
    Object getQuizById(@PathVariable UUID id);
}