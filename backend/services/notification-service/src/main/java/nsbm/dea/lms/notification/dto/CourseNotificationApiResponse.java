package nsbm.dea.lms.notification.dto;

import lombok.Data;

@Data
public class CourseNotificationApiResponse {

    private String courseName;
    private String studentName;
    private String completedDate;
    private String status;
}

