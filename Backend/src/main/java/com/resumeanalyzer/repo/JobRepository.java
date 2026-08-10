package com.resumeanalyzer.repo;

import com.resumeanalyzer.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobRepository extends JpaRepository<Job, Integer> {
}