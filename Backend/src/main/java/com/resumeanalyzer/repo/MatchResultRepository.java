package com.resumeanalyzer.repo;

import com.resumeanalyzer.entity.MatchResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MatchResultRepository
        extends JpaRepository<MatchResult, Integer> {

    Optional<MatchResult> findByResumeResumeIdAndJobJobId(
            Integer resumeId,
            Integer jobId
    );
}