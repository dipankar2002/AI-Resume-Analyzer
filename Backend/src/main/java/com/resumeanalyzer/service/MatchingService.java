package com.resumeanalyzer.service;

import com.resumeanalyzer.dto.MatchExplanationResponse;
import com.resumeanalyzer.dto.SkillMatchDetail;
import com.resumeanalyzer.entity.Job;
import com.resumeanalyzer.entity.JobSkill;
import com.resumeanalyzer.entity.MatchResult;
import com.resumeanalyzer.entity.ResumeSkill;
import com.resumeanalyzer.repo.JobRepository;
import com.resumeanalyzer.repo.JobSkillRepository;
import com.resumeanalyzer.repo.MatchResultRepository;
import com.resumeanalyzer.repo.ResumeRepository;
import com.resumeanalyzer.repo.ResumeSkillRepository;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class MatchingService {

    private final ResumeSkillRepository resumeSkillRepository;
    private final JobSkillRepository jobSkillRepository;
    private final ResumeRepository resumeRepository;
    private final JobRepository jobRepository;
    private final MatchResultRepository matchResultRepository;

    public MatchingService(
            ResumeSkillRepository resumeSkillRepository,
            JobSkillRepository jobSkillRepository,
            ResumeRepository resumeRepository,
            JobRepository jobRepository,
            MatchResultRepository matchResultRepository) {

        this.resumeSkillRepository = resumeSkillRepository;
        this.jobSkillRepository = jobSkillRepository;
        this.resumeRepository = resumeRepository;
        this.jobRepository = jobRepository;
        this.matchResultRepository = matchResultRepository;
    }

    // =========================================================
    // BASIC MATCH SCORE
    // =========================================================

    public BigDecimal calculateMatchScore(
            Integer resumeId,
            Integer jobId) {

        validateResumeAndJob(resumeId, jobId);

        List<ResumeSkill> resumeSkills =
                resumeSkillRepository.findByResumeResumeId(resumeId);

        List<JobSkill> jobSkills =
                jobSkillRepository.findByJobJobId(jobId);

        return calculateScore(
                resumeSkills,
                jobSkills
        );
    }

    // =========================================================
    // MATCH EXPLANATION
    // =========================================================

    public MatchExplanationResponse explainMatch(
            Integer resumeId,
            Integer jobId) {

        validateResumeAndJob(resumeId, jobId);

        List<ResumeSkill> resumeSkills =
                resumeSkillRepository.findByResumeResumeId(resumeId);

        List<JobSkill> jobSkills =
                jobSkillRepository.findByJobJobId(jobId);

        Map<Integer, BigDecimal> candidateSkills =
                buildCandidateSkills(resumeSkills);

        List<SkillMatchDetail> matchedSkills =
                new ArrayList<>();

        List<String> missingSkills =
                new ArrayList<>();

        List<String> missingRequiredSkills =
                new ArrayList<>();

        List<String> missingPreferredSkills =
                new ArrayList<>();

        BigDecimal totalContribution =
                BigDecimal.ZERO;

        BigDecimal totalWeight =
                BigDecimal.ZERO;

        for (JobSkill jobSkill : jobSkills) {

            Integer skillId =
                    jobSkill.getSkill()
                            .getSkillId();

            String skillName =
                    jobSkill.getSkill()
                            .getSkillName();

            BigDecimal weight =
                    jobSkill.getWeight();

            totalWeight =
                    totalWeight.add(weight);

            BigDecimal confidence =
                    candidateSkills.get(skillId);

            if (confidence != null) {

                BigDecimal contribution =
                        calculateContribution(
                                confidence,
                                weight
                        );

                totalContribution =
                        totalContribution.add(
                                contribution
                        );

                matchedSkills.add(
                        new SkillMatchDetail(
                                skillName,
                                confidence,
                                weight,
                                contribution,
                                jobSkill.getImportance().name()
                        )
                );

            } else {

                missingSkills.add(skillName);

                if (jobSkill.getImportance()
                        == JobSkill.Importance.REQUIRED) {

                    missingRequiredSkills.add(
                            skillName
                    );

                } else {

                    missingPreferredSkills.add(
                            skillName
                    );
                }
            }
        }

        /*
         * IMPORTANT:
         *
         * No additional REQUIRED skill penalty.
         *
         * Skill importance is already represented by
         * the weight assigned to each JobSkill.
         *
         * Missing skills naturally contribute 0.
         */
        BigDecimal finalScore =
                calculateNormalizedScore(
                        totalContribution,
                        totalWeight
                );

        String matchLevel =
                getMatchLevel(finalScore);

        Job job =
                jobRepository.findById(jobId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Job not found"
                                )
                        );

        return new MatchExplanationResponse(
                job.getJobId(),
                job.getTitle(),
                finalScore,
                matchLevel,
                matchedSkills,
                missingSkills,
                missingRequiredSkills,
                missingPreferredSkills
        );
    }

    // =========================================================
    // SAVE MATCH RESULT
    // =========================================================

    public MatchResult saveMatchResult(
            Integer resumeId,
            Integer jobId) {

        BigDecimal score =
                calculateMatchScore(
                        resumeId,
                        jobId
                );

        var resume =
                resumeRepository.findById(resumeId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Resume not found"
                                )
                        );

        var job =
                jobRepository.findById(jobId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Job not found"
                                )
                        );

        MatchResult matchResult =
                matchResultRepository
                        .findByResumeResumeIdAndJobJobId(
                                resumeId,
                                jobId
                        )
                        .orElseGet(
                                MatchResult::new
                        );

        matchResult.setResume(resume);
        matchResult.setJob(job);
        matchResult.setMatchScore(score);
        matchResult.setMatchedAt(
                LocalDateTime.now()
        );

        return matchResultRepository.save(
                matchResult
        );
    }

    // =========================================================
    // SCORE CALCULATION
    // =========================================================

    private BigDecimal calculateScore(
            List<ResumeSkill> resumeSkills,
            List<JobSkill> jobSkills) {

        if (jobSkills.isEmpty()) {

            return BigDecimal.ZERO.setScale(
                    2,
                    RoundingMode.HALF_UP
            );
        }

        Map<Integer, BigDecimal> candidateSkills =
                buildCandidateSkills(resumeSkills);

        BigDecimal totalContribution =
                BigDecimal.ZERO;

        BigDecimal totalWeight =
                BigDecimal.ZERO;

        for (JobSkill jobSkill : jobSkills) {

            BigDecimal weight =
                    jobSkill.getWeight();

            totalWeight =
                    totalWeight.add(weight);

            Integer skillId =
                    jobSkill.getSkill()
                            .getSkillId();

            BigDecimal confidence =
                    candidateSkills.get(skillId);

            if (confidence != null) {

                totalContribution =
                        totalContribution.add(
                                calculateContribution(
                                        confidence,
                                        weight
                                )
                        );
            }
        }

        return calculateNormalizedScore(
                totalContribution,
                totalWeight
        );
    }

    // =========================================================
    // NORMALIZED SCORE
    // =========================================================

    private BigDecimal calculateNormalizedScore(
            BigDecimal totalContribution,
            BigDecimal totalWeight) {

        if (totalWeight.compareTo(
                BigDecimal.ZERO
        ) == 0) {

            return BigDecimal.ZERO.setScale(
                    2,
                    RoundingMode.HALF_UP
            );
        }

        return totalContribution
                .divide(
                        totalWeight,
                        6,
                        RoundingMode.HALF_UP
                )
                .multiply(
                        BigDecimal.valueOf(100)
                )
                .setScale(
                        2,
                        RoundingMode.HALF_UP
                );
    }

    // =========================================================
    // CONTRIBUTION
    // =========================================================

    private BigDecimal calculateContribution(
            BigDecimal confidence,
            BigDecimal weight) {

        return confidence
                .divide(
                        BigDecimal.valueOf(100),
                        6,
                        RoundingMode.HALF_UP
                )
                .multiply(weight);
    }

    // =========================================================
    // BUILD CANDIDATE SKILLS
    // =========================================================

    private Map<Integer, BigDecimal> buildCandidateSkills(
            List<ResumeSkill> resumeSkills) {

        Map<Integer, BigDecimal> candidateSkills =
                new HashMap<>();

        for (ResumeSkill resumeSkill : resumeSkills) {

            Integer skillId =
                    resumeSkill.getSkill()
                            .getSkillId();

            candidateSkills.put(
                    skillId,
                    resumeSkill.getConfidence()
            );
        }

        return candidateSkills;
    }

    // =========================================================
    // MATCH LEVEL
    // =========================================================

    private String getMatchLevel(
            BigDecimal score) {

        if (score.compareTo(
                BigDecimal.valueOf(80)
        ) >= 0) {

            return "EXCELLENT";
        }

        if (score.compareTo(
                BigDecimal.valueOf(65)
        ) >= 0) {

            return "GOOD";
        }

        if (score.compareTo(
                BigDecimal.valueOf(50)
        ) >= 0) {

            return "MODERATE";
        }

        if (score.compareTo(
                BigDecimal.valueOf(30)
        ) >= 0) {

            return "LOW";
        }

        return "VERY_LOW";
    }

    // =========================================================
    // VALIDATION
    // =========================================================

    private void validateResumeAndJob(
            Integer resumeId,
            Integer jobId) {

        if (!resumeRepository.existsById(
                resumeId
        )) {

            throw new RuntimeException(
                    "Resume not found"
            );
        }

        if (!jobRepository.existsById(
                jobId
        )) {

            throw new RuntimeException(
                    "Job not found"
            );
        }
    }
}