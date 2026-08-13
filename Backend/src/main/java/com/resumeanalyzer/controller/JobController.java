package com.resumeanalyzer.controller;

import com.resumeanalyzer.entity.Job;
import com.resumeanalyzer.dto.AdzunaJobResponse;
import com.resumeanalyzer.service.AdzunaService;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final AdzunaService adzunaService;

    public JobController(
            AdzunaService adzunaService) {

        this.adzunaService = adzunaService;
    }

    // =========================================================
    // ALL LIVE JOBS
    // =========================================================

    @GetMapping("/live")
    public AdzunaJobResponse getLiveJobs(
            @RequestParam String keyword,
            @RequestParam(
                    defaultValue = "India"
            ) String location
    ) {

        return adzunaService.searchJobs(
                keyword,
                location,
                1,
                10
        );
    }

    // =========================================================
    // PERSONALIZED JOBS
    // =========================================================

    @GetMapping("/live/personalized")
    public List<Job> getPersonalizedJobs(
            Authentication authentication
    ) {

        String clerkUserId =
                authentication.getName();

        return adzunaService.getPersonalizedJobs(
                clerkUserId
        );
    }
}