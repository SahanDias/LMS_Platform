package com.lms.videoservice.client;

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
        String url = enrollmentServiceUrl + "/enrollments/check?studentId=" + studentId + "&classId=" + classId;
        try {
            Boolean isEnrolled = restTemplate.getForObject(url, Boolean.class);
            return isEnrolled != null && isEnrolled;
        } catch (Exception e) {
            // Log error and handle appropriately (e.g., return false or throw custom exception)
            return false;
        }
    }
}
