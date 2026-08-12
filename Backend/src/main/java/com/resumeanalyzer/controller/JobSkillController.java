package com.resumeanalyzer.controller;

import com.resumeanalyzer.service.JobSkillService;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/job-skills")
public class JobSkillController {

    private final JobSkillService jobSkillService;

    public JobSkillController(
            JobSkillService jobSkillService) {

        this.jobSkillService =
                jobSkillService;
    }

    @PostMapping("/extract/{jobId}")
    public String extractJobSkills(
            @PathVariable Integer jobId) {

        int count =
                jobSkillService
                        .extractAndSaveSkills(jobId);

        return "Extracted and saved "
                + count
                + " skills for job "
                + jobId;
    }
}