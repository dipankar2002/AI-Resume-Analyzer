package com.resumeanalyzer.controller;

import com.resumeanalyzer.service.GeminiService;
import com.resumeanalyzer.service.ResumeAnalysisResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai")
public class GeminiController {

    private final GeminiService geminiService;

    public GeminiController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @GetMapping("/test")
    public String testAI() {
        return geminiService.testGemini();
    }

    @PostMapping("/skills")
    public List<GeminiService.ExtractedSkill> extractSkills(
            @RequestBody String resumeText) {

        return geminiService.extractSkills(resumeText);
    }

    @PostMapping("/analyze/{resumeId}")
    public List<GeminiService.ExtractedSkill> analyzeResume(
            @PathVariable Integer resumeId) {

        return geminiService.analyzeResume(resumeId);
    }

    @PostMapping("/ats/{resumeId}")
    public ResumeAnalysisResponse analyzeATS(
            @PathVariable Integer resumeId) {

        return geminiService.analyzeResumeContent(
                geminiService.getResumeText(resumeId)
        );
    }
}