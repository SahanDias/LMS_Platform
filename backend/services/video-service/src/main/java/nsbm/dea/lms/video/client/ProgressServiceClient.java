package nsbm.dea.lms.video.client;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class ProgressServiceClient {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${progress.service.url}")
    private String progressServiceUrl;

    public void notifyVideoCompletion(Long studentId, Long videoId) {
        // Mock implementation for now
        // String url = progressServiceUrl + "/progress/video-completion";
        // VideoCompletionRequest request = new VideoCompletionRequest(studentId, videoId);
        // restTemplate.postForObject(url, request, Void.class);
        System.out.println("Mock: Notified progress service for student " + studentId + " and video " + videoId);
    }

    private static class VideoCompletionRequest {
        private Long studentId;
        private Long videoId;

        public VideoCompletionRequest(Long studentId, Long videoId) {
            this.studentId = studentId;
            this.videoId = videoId;
        }

        public Long getStudentId() {
            return studentId;
        }

        public Long getVideoId() {
            return videoId;
        }
    }
}
