package com.resumeanalyzer.controller;

import com.resumeanalyzer.entity.Job;
import com.resumeanalyzer.repo.JobRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobRepository jobRepository;

    public JobController(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    @GetMapping
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    @GetMapping("/{jobId}")
    public Job getJob(@PathVariable Integer jobId) {
        return jobRepository.findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException("Job not found"));
    }
}