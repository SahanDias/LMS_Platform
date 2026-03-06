package nsbm.dea.lms.video.client;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class EnrollmentServiceClient {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${enrollment.service.url}")
    private String enrollmentServiceUrl;

    public boolean isStudentEnrolled(Long studentId, Long classId) {
        // Mock implementation for now
        // In a real scenario, this would call the Enrollment Service
        // String url = enrollmentServiceUrl + "/enrollments/check?studentId=" + studentId + "&classId=" + classId;
        // return restTemplate.getForObject(url, Boolean.class);
        return true;
    }
}
