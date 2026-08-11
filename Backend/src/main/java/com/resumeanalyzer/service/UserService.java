package com.resumeanalyzer.service;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.resumeanalyzer.entity.User;
import com.resumeanalyzer.repo.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final ClerkService clerkService;

    public UserService(
            UserRepository userRepository,
            ClerkService clerkService) {

        this.userRepository = userRepository;
        this.clerkService = clerkService;
    }

    public User getOrCreateUser(String clerkUserId) {

        return userRepository.findByClerkUserId(clerkUserId)
                .orElseGet(() -> {

                    Map<String, Object> clerkUser = clerkService.getUser(clerkUserId);

                    User user = new User();

                    user.setClerkUserId(clerkUserId);
                    user.setEmail(extractEmail(clerkUser));
                    user.setName((String) clerkUser.get("first_name"));
                    user.setRole(User.Role.STUDENT);

                    return userRepository.save(user);
                });
    }

    private String extractEmail(Map<String, Object> clerkUser) {

        var emails = (java.util.List<Map<String, Object>>)
                clerkUser.get("email_addresses");

        if (emails == null || emails.isEmpty()) {
            throw new RuntimeException("Clerk user has no email");
        }

        return (String) emails.get(0).get("email_address");
    }
}