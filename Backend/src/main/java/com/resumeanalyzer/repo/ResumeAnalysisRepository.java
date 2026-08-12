package com.resumeanalyzer.repo;

import com.resumeanalyzer.entity.ResumeAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ResumeAnalysisRepository
        extends JpaRepository<ResumeAnalysis, Integer> {

    Optional<ResumeAnalysis> findByResumeResumeId(Integer resumeId);

    List<ResumeAnalysis> findByResumeUserUserId(Integer userId);
}