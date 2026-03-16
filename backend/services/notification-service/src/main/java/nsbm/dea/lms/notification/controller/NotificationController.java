package nsbm.dea.lms.notification.controller;

import lombok.RequiredArgsConstructor;
import nsbm.dea.lms.notification.dto.NotificationResponse;
import nsbm.dea.lms.notification.service.NotificationQueryService;
import nsbm.dea.lms.notification.service.NotificationSyncService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationQueryService notificationQueryService;
    private final NotificationSyncService notificationSyncService;

    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getNotifications(
            @RequestParam(name = "type", required = false) String type
    ) {
        List<NotificationResponse> notifications = notificationQueryService.getNotifications(type);
        return ResponseEntity.ok(notifications);
    }

    // Optional: manual trigger for testing sync
    @GetMapping("/sync")
    public ResponseEntity<Void> triggerSyncNow() {
        notificationSyncService.syncCourseNotifications();
        notificationSyncService.syncPaymentNotifications();
        return ResponseEntity.accepted().build();
    }
}

