package com.resumeanalyzer.controller;

import com.resumeanalyzer.entity.ResumeAnalysis;
import com.resumeanalyzer.service.ResumeAnalysisService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/resume-analysis")
public class ResumeAnalysisController {

    private final ResumeAnalysisService resumeAnalysisService;

    public ResumeAnalysisController(
            ResumeAnalysisService resumeAnalysisService) {

        this.resumeAnalysisService = resumeAnalysisService;
    }

    @PostMapping("/{resumeId}")
    public ResumeAnalysis analyzeResume(
            @PathVariable Integer resumeId) {

        return resumeAnalysisService.analyzeResume(resumeId);
    }
}