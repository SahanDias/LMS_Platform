package nsbm.dea.lms.video.controller;

import nsbm.dea.lms.video.dto.VideoRequest;
import nsbm.dea.lms.video.dto.VideoResponse;
import nsbm.dea.lms.video.service.VideoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/videos")
public class VideoController {

    @Autowired
    private VideoService videoService;

    @GetMapping
    public ResponseEntity<List<VideoResponse>> getAllVideos() {
        return ResponseEntity.ok(videoService.getAllVideos());
    }

    @PostMapping
    public ResponseEntity<VideoResponse> createVideo(@RequestBody VideoRequest videoRequest) {
        VideoResponse createdVideo = videoService.createVideo(videoRequest);
        return new ResponseEntity<>(createdVideo, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<VideoResponse> updateVideo(@PathVariable Long id, @RequestBody VideoRequest videoRequest) {
        VideoResponse updatedVideo = videoService.updateVideo(id, videoRequest);
        return ResponseEntity.ok(updatedVideo);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVideo(@PathVariable Long id) {
        videoService.deleteVideo(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<VideoResponse> getVideoById(@PathVariable Long id) {
        VideoResponse video = videoService.getVideoById(id);
        return ResponseEntity.ok(video);
    }

    @GetMapping("/class/{classId}")
    public ResponseEntity<List<VideoResponse>> getVideosByClassId(@PathVariable Long classId) {
        List<VideoResponse> videos = videoService.getVideosByClassId(classId);
        return ResponseEntity.ok(videos);
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<Void> markVideoCompleted(@PathVariable Long id, @RequestParam Long studentId) {
        videoService.markVideoCompleted(id, studentId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/completion/{studentId}")
    public ResponseEntity<Boolean> getCompletionStatus(@PathVariable Long id, @PathVariable Long studentId) {
        boolean isCompleted = videoService.getCompletionStatus(id, studentId);
        return ResponseEntity.ok(isCompleted);
    }
}
