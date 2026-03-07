package nsbm.dea.lms.video.service;

import nsbm.dea.lms.video.client.EnrollmentServiceClient;
import nsbm.dea.lms.video.client.ProgressServiceClient;
import nsbm.dea.lms.video.dto.VideoRequest;
import nsbm.dea.lms.video.dto.VideoResponse;
import nsbm.dea.lms.video.entity.Video;
import nsbm.dea.lms.video.entity.VideoCompletion;
import nsbm.dea.lms.video.mapper.VideoMapper;
import nsbm.dea.lms.video.repository.VideoCompletionRepository;
import nsbm.dea.lms.video.repository.VideoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class VideoService {

    @Autowired
    private VideoRepository videoRepository;

    @Autowired
    private VideoCompletionRepository videoCompletionRepository;

    @Autowired
    private VideoMapper videoMapper;

    @Autowired
    private EnrollmentServiceClient enrollmentServiceClient;

    @Autowired
    private ProgressServiceClient progressServiceClient;

    public List<VideoResponse> getAllVideos() {
        return videoRepository.findAll().stream()
                .map(videoMapper::toResponse)
                .collect(Collectors.toList());
    }

    public VideoResponse createVideo(VideoRequest videoRequest) {
        Video video = videoMapper.toEntity(videoRequest);
        Video savedVideo = videoRepository.save(video);
        return videoMapper.toResponse(savedVideo);
    }

    public VideoResponse updateVideo(Long id, VideoRequest videoRequest) {
        Video video = videoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Video not found with id: " + id));

        video.setTitle(videoRequest.getTitle());
        video.setDescription(videoRequest.getDescription());
        video.setVideoUrl(videoRequest.getVideoUrl());
        video.setDuration(videoRequest.getDuration());
        video.setOrderIndex(videoRequest.getOrderIndex());
        video.setIsActive(videoRequest.getIsActive());

        Video updatedVideo = videoRepository.save(video);
        return videoMapper.toResponse(updatedVideo);
    }

    public void deleteVideo(Long id) {
        Video video = videoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Video not found with id: " + id));
        videoRepository.delete(video);
    }

    public VideoResponse getVideoById(Long id) {
        Video video = videoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Video not found with id: " + id));
        return videoMapper.toResponse(video);
    }

    public List<VideoResponse> getVideosByClassId(Long classId) {
        return videoRepository.findByClassIdAndIsActiveTrue(classId).stream()
                .map(videoMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void markVideoCompleted(Long videoId, Long studentId) {
        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new RuntimeException("Video not found with id: " + videoId));

        if (!enrollmentServiceClient.isStudentEnrolled(studentId, video.getClassId())) {
            throw new RuntimeException("Student is not enrolled in the class for this video");
        }

        Optional<VideoCompletion> existingCompletion = videoCompletionRepository.findByVideoIdAndStudentId(videoId, studentId);

        if (existingCompletion.isPresent()) {
            VideoCompletion completion = existingCompletion.get();
            if (!completion.getCompleted()) {
                completion.setCompleted(true);
                completion.setCompletedAt(LocalDateTime.now());
                videoCompletionRepository.save(completion);
            }
        } else {
            VideoCompletion newCompletion = new VideoCompletion();
            newCompletion.setVideoId(videoId);
            newCompletion.setStudentId(studentId);
            newCompletion.setCompleted(true);
            newCompletion.setCompletedAt(LocalDateTime.now());
            videoCompletionRepository.save(newCompletion);
        }

        progressServiceClient.notifyVideoCompletion(studentId, videoId);
    }

    public boolean getCompletionStatus(Long videoId, Long studentId) {
        return videoCompletionRepository.findByVideoIdAndStudentId(videoId, studentId)
                .map(VideoCompletion::getCompleted)
                .orElse(false);
    }
}
