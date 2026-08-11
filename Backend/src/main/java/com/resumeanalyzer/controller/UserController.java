package com.resumeanalyzer.controller;

import com.resumeanalyzer.entity.User;
import com.resumeanalyzer.service.UserService;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public User getCurrentUser(
            @AuthenticationPrincipal Jwt jwt) {

        String clerkUserId = jwt.getSubject();

        return userService.getOrCreateUser(clerkUserId);
    }
}