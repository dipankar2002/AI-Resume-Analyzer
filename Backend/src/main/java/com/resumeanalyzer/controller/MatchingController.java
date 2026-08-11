package com.resumeanalyzer.controller;

import com.resumeanalyzer.service.MatchingService;
import org.springframework.web.bind.annotation.*;
import com.resumeanalyzer.dto.MatchExplanationResponse;
import java.math.BigDecimal;
import com.resumeanalyzer.entity.MatchResult;

@RestController
@RequestMapping("/api/matching")
public class MatchingController {

    private final MatchingService matchingService;

    public MatchingController(MatchingService matchingService) {
        this.matchingService = matchingService;
    }

    @GetMapping("/{resumeId}/{jobId}")
    public BigDecimal calculateMatch(
            @PathVariable Integer resumeId,
            @PathVariable Integer jobId) {

        return matchingService.calculateMatchScore(
                resumeId,
                jobId
        );
    }
    @GetMapping("/{resumeId}/{jobId}/explanation")
    public MatchExplanationResponse explainMatch(
            @PathVariable Integer resumeId,
            @PathVariable Integer jobId) {

        return matchingService.explainMatch(
                resumeId,
                jobId
        );
    }

    @PostMapping("/{resumeId}/{jobId}")
    public MatchResult saveMatch(
            @PathVariable Integer resumeId,
            @PathVariable Integer jobId) {

        return matchingService.saveMatchResult(
                resumeId,
                jobId
        );
    }
}