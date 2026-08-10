package com.resumeanalyzer.dto;

import java.math.BigDecimal;
import java.util.List;

public record MatchExplanationResponse(
        Integer jobId,
        String jobTitle,
        BigDecimal matchScore,
        List<SkillMatchDetail> matchedSkills,
        List<String> missingSkills
) {
}