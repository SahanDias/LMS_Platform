package com.lms.videoservice.controller;

import com.lms.videoservice.entity.Video;
import com.lms.videoservice.entity.VideoCompletion;
import com.lms.videoservice.service.VideoService;
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
    public ResponseEntity<List<Video>> getAllVideos() {
        return ResponseEntity.ok(videoService.getAllVideos());
    }

    @PostMapping
    public ResponseEntity<Video> createVideo(@RequestBody Video video) {
        Video createdVideo = videoService.createVideo(video);
        return new ResponseEntity<>(createdVideo, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Video> updateVideo(@PathVariable Long id, @RequestBody Video videoDetails) {
        try {
            Video updatedVideo = videoService.updateVideo(id, videoDetails);
            return ResponseEntity.ok(updatedVideo);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVideo(@PathVariable Long id) {
        try {
            videoService.deleteVideo(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Video> getVideoById(@PathVariable Long id) {
        try {
            Video video = videoService.getVideoById(id);
            return ResponseEntity.ok(video);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/class/{classId}")
    public ResponseEntity<List<Video>> getVideosByClassId(@PathVariable Long classId) {
        List<Video> videos = videoService.getVideosByClassId(classId);
        return ResponseEntity.ok(videos);
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<VideoCompletion> markVideoCompleted(@PathVariable Long id, @RequestParam Long studentId) {
        try {
            VideoCompletion completion = videoService.markVideoCompleted(id, studentId);
            return ResponseEntity.ok(completion);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}/completion/{studentId}")
    public ResponseEntity<Boolean> getCompletionStatus(@PathVariable Long id, @PathVariable Long studentId) {
        boolean isCompleted = videoService.getCompletionStatus(id, studentId);
        return ResponseEntity.ok(isCompleted);
    }
}
