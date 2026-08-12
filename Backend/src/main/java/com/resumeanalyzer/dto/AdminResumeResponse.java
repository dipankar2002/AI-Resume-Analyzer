package com.resumeanalyzer.dto;

import java.time.LocalDateTime;

public record AdminResumeResponse(
        Integer resumeId,
        Integer userId,
        String candidateName,
        String candidateEmail,
        String fileName,
        LocalDateTime uploadedAt
) {
}
