package nsbm.dea.lms.video.client;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class ContentFlowServiceClient {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${contentflow.service.url}")
    private String contentFlowServiceUrl;

    public boolean validateOrderIndex(Long classId, Integer orderIndex) {
        // Mock implementation for now
        // String url = contentFlowServiceUrl + "/content-flow/validate?classId=" + classId + "&orderIndex=" + orderIndex;
        // return restTemplate.getForObject(url, Boolean.class);
        return true;
    }
}
