package com.resumeanalyzer.dto;

import java.math.BigDecimal;

public record SkillMatchDetail(
        String skill,
        BigDecimal confidence,
        BigDecimal weight,
        BigDecimal contribution
) {
}