package com.resumeanalyzer.dto;

import java.math.BigDecimal;
import java.util.List;

public record MatchExplanationResponse(
        Integer jobId,
        String jobTitle,
        BigDecimal matchScore,
        String matchLevel,
        List<SkillMatchDetail> matchedSkills,
        List<String> missingSkills,
        List<String> missingRequiredSkills,
        List<String> missingPreferredSkills
) {
}