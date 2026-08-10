package com.resumeanalyzer.controller;

import com.resumeanalyzer.dto.JobRecommendationResponse;
import com.resumeanalyzer.service.RecommendationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(
            RecommendationService recommendationService) {

        this.recommendationService = recommendationService;
    }

    @GetMapping("/user/{userId}")
    public List<JobRecommendationResponse> getRecommendations(
            @PathVariable Integer userId) {

        return recommendationService.getRecommendations(userId);
    }
}