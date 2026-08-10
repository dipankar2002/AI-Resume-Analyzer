package com.resumeanalyzer.dto;

import java.math.BigDecimal;

public record JobRecommendationResponse(
        Integer jobId,
        String title,
        String company,
        String location,
        String salary,
        String jobType,
        BigDecimal matchScore
) {
}