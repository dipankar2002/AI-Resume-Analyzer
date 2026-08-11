package com.resumeanalyzer.controller;

import com.resumeanalyzer.entity.Resume;
import com.resumeanalyzer.entity.User;
import com.resumeanalyzer.service.ResumeService;
import com.resumeanalyzer.service.UserService;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/resume")
public class ResumeController {

    private final ResumeService resumeService;
    private final UserService userService;

    public ResumeController(
            ResumeService resumeService,
            UserService userService) {

        this.resumeService = resumeService;
        this.userService = userService;
    }

    @PostMapping("/upload")
    public Resume uploadResume(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) throws Exception {

        String clerkUserId = authentication.getName();

        User user = userService.getOrCreateUser(clerkUserId);

        return resumeService.uploadResume(
                file,
                user.getUserId()
        );
    }
}