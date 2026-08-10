package com.resumeanalyzer.dto;

import java.time.LocalDateTime;

public record ResumeListResponse(
        Integer resumeId,
        String fileName,
        LocalDateTime uploadedAt
) {
}