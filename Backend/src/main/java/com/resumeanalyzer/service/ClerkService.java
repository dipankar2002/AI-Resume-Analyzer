package com.resumeanalyzer.service;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class ClerkService {

    private final RestClient restClient;

    public ClerkService(
            @Value("${clerk.secret-key}") String secretKey) {

        this.restClient = RestClient.builder()
                .baseUrl("https://api.clerk.com/v1")
                .defaultHeader(
                        "Authorization",
                        "Bearer " + secretKey
                )
                .build();
    }

    public Map<String, Object> getUser(String clerkUserId) {

        return restClient.get()
                .uri("/users/{userId}", clerkUserId)
                .retrieve()
                .body(Map.class);
    }
}