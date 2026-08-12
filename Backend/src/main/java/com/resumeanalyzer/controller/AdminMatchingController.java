package com.resumeanalyzer.controller;

import com.resumeanalyzer.dto.AdminJobMatchResponse;
import com.resumeanalyzer.dto.AdminResumeResponse;
import com.resumeanalyzer.entity.User;
import com.resumeanalyzer.repo.UserRepository;
import com.resumeanalyzer.service.AdminMatchingService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/admin/matching")
public class AdminMatchingController {

    private final AdminMatchingService adminMatchingService;
    private final UserRepository userRepository;

    public AdminMatchingController(
            AdminMatchingService adminMatchingService,
            UserRepository userRepository) {
        this.adminMatchingService = adminMatchingService;
        this.userRepository = userRepository;
    }

    @GetMapping("/resumes")
    public List<AdminResumeResponse> getResumes(
            @AuthenticationPrincipal Jwt jwt) {
        requireAdmin(jwt);
        return adminMatchingService.getResumes();
    }

    @GetMapping("/resumes/{resumeId}/jobs")
    public List<AdminJobMatchResponse> getRankedJobs(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Integer resumeId) {
        requireAdmin(jwt);
        return adminMatchingService.getRankedJobMatches(resumeId);
    }

    private void requireAdmin(Jwt jwt) {
        if (jwt == null || jwt.getSubject() == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Authentication required"
            );
        }

        User user = userRepository.findByClerkUserId(jwt.getSubject())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "User is not registered"
                ));

        if (user.getRole() != User.Role.ADMIN) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Admin access required"
            );
        }
    }
}
