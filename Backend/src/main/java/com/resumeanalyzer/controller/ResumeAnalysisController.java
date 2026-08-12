package com.resumeanalyzer.controller;

import com.resumeanalyzer.entity.ResumeAnalysis;
import com.resumeanalyzer.entity.User;
import com.resumeanalyzer.service.ResumeAnalysisService;
import com.resumeanalyzer.service.UserService;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resume-analysis")
public class ResumeAnalysisController {

    private final ResumeAnalysisService resumeAnalysisService;
    private final UserService userService;

    public ResumeAnalysisController(
            ResumeAnalysisService resumeAnalysisService,
            UserService userService) {

        this.resumeAnalysisService = resumeAnalysisService;
        this.userService = userService;
    }

    @PostMapping("/{resumeId}")
    public ResumeAnalysis analyzeResume(
            @PathVariable Integer resumeId,
            Authentication authentication) {

        String clerkUserId = authentication.getName();

        User user = userService.getOrCreateUser(clerkUserId);

        return resumeAnalysisService.analyzeResume(
                resumeId,
                user.getUserId()
        );
    }

    @GetMapping("/me")
    public List<ResumeAnalysis> getMyAnalyses(
            Authentication authentication) {

        String clerkUserId = authentication.getName();

        User user = userService.getOrCreateUser(clerkUserId);

        return resumeAnalysisService.getUserAnalyses(
                user.getUserId()
        );
    }
}