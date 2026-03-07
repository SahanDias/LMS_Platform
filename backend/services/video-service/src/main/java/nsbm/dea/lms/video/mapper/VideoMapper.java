package nsbm.dea.lms.video.mapper;

import nsbm.dea.lms.video.dto.VideoRequest;
import nsbm.dea.lms.video.dto.VideoResponse;
import nsbm.dea.lms.video.entity.Video;
import org.springframework.stereotype.Component;

@Component
public class VideoMapper {

    public VideoResponse toResponse(Video video) {
        if (video == null) {
            return null;
        }
        return new VideoResponse(
                video.getId(),
                video.getClassId(),
                video.getTitle(),
                video.getDescription(),
                video.getVideoUrl(),
                video.getDuration(),
                video.getOrderIndex(),
                video.getIsActive(),
                video.getCreatedAt(),
                video.getUpdatedAt()
        );
    }

    public Video toEntity(VideoRequest videoRequest) {
        if (videoRequest == null) {
            return null;
        }
        Video video = new Video();
        video.setClassId(videoRequest.getClassId());
        video.setTitle(videoRequest.getTitle());
        video.setDescription(videoRequest.getDescription());
        video.setVideoUrl(videoRequest.getVideoUrl());
        video.setDuration(videoRequest.getDuration());
        video.setOrderIndex(videoRequest.getOrderIndex());
        video.setIsActive(videoRequest.getIsActive());
        return video;
    }
}
