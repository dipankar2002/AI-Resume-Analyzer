package com.resumeanalyzer.dto;

import java.math.BigDecimal;
import java.util.List;

public record AdminJobMatchResponse(
        Integer rank,
        Integer jobId,
        String title,
        String company,
        String location,
        String salary,
        String jobType,
        BigDecimal matchScore,
        List<String> requiredSkills,
        List<String> matchedSkills,
        List<String> missingSkills
) {
}
