package com.lms.videoservice.service;

import com.lms.videoservice.entity.Video;
import com.lms.videoservice.entity.VideoCompletion;
import com.lms.videoservice.repository.VideoCompletionRepository;
import com.lms.videoservice.repository.VideoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class VideoService {

    @Autowired
    private VideoRepository videoRepository;

    @Autowired
    private VideoCompletionRepository videoCompletionRepository;

    public Video createVideo(Video video) {
        return videoRepository.save(video);
    }

    public Video updateVideo(Long id, Video videoDetails) {
        Video video = videoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Video not found with id: " + id));

        video.setTitle(videoDetails.getTitle());
        video.setDescription(videoDetails.getDescription());
        video.setVideoUrl(videoDetails.getVideoUrl());
        video.setDuration(videoDetails.getDuration());
        video.setOrderIndex(videoDetails.getOrderIndex());
        video.setIsActive(videoDetails.getIsActive());

        return videoRepository.save(video);
    }

    public void deleteVideo(Long id) {
        Video video = videoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Video not found with id: " + id));
        videoRepository.delete(video);
    }

    public Video getVideoById(Long id) {
        return videoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Video not found with id: " + id));
    }

    public List<Video> getVideosByClassId(Long classId) {
        return videoRepository.findByClassIdAndIsActiveTrue(classId);
    }

    @Transactional
    public VideoCompletion markVideoCompleted(Long videoId, Long studentId) {
        // Check if video exists
        if (!videoRepository.existsById(videoId)) {
            throw new RuntimeException("Video not found with id: " + videoId);
        }

        Optional<VideoCompletion> existingCompletion = videoCompletionRepository.findByVideoIdAndStudentId(videoId, studentId);

        if (existingCompletion.isPresent()) {
            VideoCompletion completion = existingCompletion.get();
            if (!completion.getCompleted()) {
                completion.setCompleted(true);
                completion.setCompletedAt(LocalDateTime.now());
                return videoCompletionRepository.save(completion);
            }
            return completion;
        }

        VideoCompletion newCompletion = new VideoCompletion();
        newCompletion.setVideoId(videoId);
        newCompletion.setStudentId(studentId);
        newCompletion.setCompleted(true);
        newCompletion.setCompletedAt(LocalDateTime.now());

        return videoCompletionRepository.save(newCompletion);
    }

    public boolean getCompletionStatus(Long videoId, Long studentId) {
        return videoCompletionRepository.findByVideoIdAndStudentId(videoId, studentId)
                .map(VideoCompletion::getCompleted)
                .orElse(false);
    }

    public List<Video> getAllVideos() {
        return videoRepository.findAll();
    }
}
