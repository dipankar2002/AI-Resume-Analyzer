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
            UserService userService
    ) {

        this.recommendationService =
                recommendationService;

        this.userService =
                userService;
    }

    // =========================================================
    // PERSONALIZED RECOMMENDATIONS
    // =========================================================

    @GetMapping("/me")
    public List<JobRecommendationResponse>
    getRecommendations(
            @AuthenticationPrincipal Jwt jwt
    ) {

        User user =
                userService.getOrCreateUser(
                        jwt.getSubject()
                );

        return recommendationService
                .getRecommendations(
                        user.getUserId()
                );
    }

    // =========================================================
    // FILTERED SEARCH
    // =========================================================

    @GetMapping("/me/search")
    public List<JobRecommendationResponse>
    searchRecommendations(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam String keyword,
            @RequestParam(defaultValue = "India")
            String location,
            @RequestParam(defaultValue = "all")
            String jobType
    ) {

        User user =
                userService.getOrCreateUser(
                        jwt.getSubject()
                );

        return recommendationService
                .searchRecommendations(
                        user.getUserId(),
                        keyword,
                        location,
                        jobType
                );
    }
}