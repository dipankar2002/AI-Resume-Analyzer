package com.resumeanalyzer.controller;

import com.resumeanalyzer.dto.JobRecommendationResponse;
import com.resumeanalyzer.entity.User;
import com.resumeanalyzer.service.RecommendationService;
import com.resumeanalyzer.service.UserService;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;
    private final UserService userService;

    public RecommendationController(
            RecommendationService recommendationService,
            UserService userService) {

        this.recommendationService =
                recommendationService;

        this.userService =
                userService;
    }
    @GetMapping("/{userId}")
    public List<JobRecommendationResponse> getRecommendationsByUser(
            @PathVariable Integer userId) {

        return recommendationService.getRecommendations(userId);
    }

    @GetMapping("/me")
    public List<JobRecommendationResponse>
    getRecommendations(
            @AuthenticationPrincipal Jwt jwt) {

        String clerkUserId =
                jwt.getSubject();

        User user =
                userService.getOrCreateUser(
                        clerkUserId
                );

        return recommendationService
                .getRecommendations(
                        user.getUserId()
                );
    }
}