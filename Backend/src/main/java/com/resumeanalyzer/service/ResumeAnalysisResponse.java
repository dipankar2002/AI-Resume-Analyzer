package com.resumeanalyzer.service;

import java.math.BigDecimal;
import java.util.List;

public record ResumeAnalysisResponse(
        BigDecimal atsScore,
        String professionalSummary,
        List<String> strengths,
        List<String> weaknesses,
        List<String> suggestions
) {
}