package com.resumeanalyzer.repo;

import com.resumeanalyzer.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface JobRepository extends JpaRepository<Job, Integer> {

    Optional<Job> findByRedirectUrl(String redirectUrl);
}
