package com.lms.videoservice.repository;

import com.lms.videoservice.entity.Video;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VideoRepository extends JpaRepository<Video, Long> {
    List<Video> findByClassIdAndIsActiveTrue(Long classId);
}