package com.resumeanalyzer.dto;

import java.math.BigDecimal;
import java.util.List;

public record JobRecommendationResponse(
        Integer jobId,
        String title,
        String company,
        String location,
        String salary,
        String jobType,
        String redirectUrl,
        BigDecimal matchScore,
        String matchLevel,
        Integer matchedSkills,
        Integer totalResumeSkills,
        List<String> matchedSkillNames
) {
}