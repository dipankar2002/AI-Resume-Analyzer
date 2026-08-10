package com.resumeanalyzer.service;

import com.resumeanalyzer.entity.Job;
import com.resumeanalyzer.entity.JobSkill;
import com.resumeanalyzer.entity.MatchResult;
import com.resumeanalyzer.entity.Resume;
import com.resumeanalyzer.entity.ResumeSkill;
import com.resumeanalyzer.repo.JobRepository;
import com.resumeanalyzer.repo.JobSkillRepository;
import com.resumeanalyzer.repo.MatchResultRepository;
import com.resumeanalyzer.repo.ResumeRepository;
import com.resumeanalyzer.repo.ResumeSkillRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.time.LocalDateTime;
import com.resumeanalyzer.dto.MatchExplanationResponse;
import com.resumeanalyzer.dto.SkillMatchDetail;
import com.resumeanalyzer.entity.ResumeSkill;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.math.RoundingMode;
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

    public BigDecimal calculateMatchScore(
            Integer resumeId,
            Integer jobId) {

        List<ResumeSkill> resumeSkills =
                resumeSkillRepository.findAll()
                        .stream()
                        .filter(rs ->
                                rs.getResume()
                                        .getResumeId()
                                        .equals(resumeId))
                        .toList();

        List<JobSkill> jobSkills =
                jobSkillRepository.findByJobJobId(jobId);

        Map<String, BigDecimal> candidateSkills = new HashMap<>();

        for (ResumeSkill resumeSkill : resumeSkills) {

            String skillName =
                    resumeSkill.getSkill()
                            .getSkillName()
                            .toLowerCase();

            candidateSkills.put(
                    skillName,
                    resumeSkill.getConfidence()
            );
        }

        BigDecimal totalScore = BigDecimal.ZERO;

        for (JobSkill jobSkill : jobSkills) {

            String skillName =
                    jobSkill.getSkill()
                            .getSkillName()
                            .toLowerCase();

            BigDecimal confidence =
                    candidateSkills.get(skillName);

            if (confidence != null) {

                BigDecimal contribution =
                        confidence
                                .divide(
                                        BigDecimal.valueOf(100),
                                        4,
                                        RoundingMode.HALF_UP
                                )
                                .multiply(jobSkill.getWeight());

                totalScore = totalScore.add(contribution);
            }
        }

        BigDecimal finalScore =
                totalScore.setScale(
                        2,
                        RoundingMode.HALF_UP
                );

        // Get resume and job
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() ->
                        new RuntimeException("Resume not found"));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException("Job not found"));

        // Check if result already exists
        MatchResult matchResult =
                matchResultRepository
                        .findByResumeResumeIdAndJobJobId(
                                resumeId,
                                jobId
                        )
                        .orElseGet(MatchResult::new);

        matchResult.setResume(resume);
        matchResult.setJob(job);
        matchResult.setMatchScore(finalScore);
        matchResult.setMatchedAt(LocalDateTime.now());

        matchResultRepository.save(matchResult);

        return finalScore;
    }
    public MatchExplanationResponse explainMatch(
            Integer resumeId,
            Integer jobId) {

        List<ResumeSkill> resumeSkills =
                resumeSkillRepository.findAll()
                        .stream()
                        .filter(rs ->
                                rs.getResume()
                                        .getResumeId()
                                        .equals(resumeId))
                        .toList();

        List<JobSkill> jobSkills =
                jobSkillRepository.findByJobJobId(jobId);

        Map<String, BigDecimal> candidateSkills = new HashMap<>();

        for (ResumeSkill resumeSkill : resumeSkills) {

            String skillName =
                    resumeSkill.getSkill()
                            .getSkillName()
                            .toLowerCase();

            candidateSkills.put(
                    skillName,
                    resumeSkill.getConfidence()
            );
        }

        List<SkillMatchDetail> matchedSkills =
                new java.util.ArrayList<>();

        List<String> missingSkills =
                new java.util.ArrayList<>();

        BigDecimal totalScore = BigDecimal.ZERO;

        for (JobSkill jobSkill : jobSkills) {

            String skillName =
                    jobSkill.getSkill()
                            .getSkillName()
                            .toLowerCase();

            BigDecimal confidence =
                    candidateSkills.get(skillName);

            if (confidence != null) {

                BigDecimal contribution =
                        confidence
                                .divide(
                                        BigDecimal.valueOf(100),
                                        4,
                                        RoundingMode.HALF_UP
                                )
                                .multiply(jobSkill.getWeight());

                contribution =
                        contribution.setScale(
                                2,
                                RoundingMode.HALF_UP
                        );

                totalScore =
                        totalScore.add(contribution);

                matchedSkills.add(
                        new SkillMatchDetail(
                                jobSkill.getSkill().getSkillName(),
                                confidence,
                                jobSkill.getWeight(),
                                contribution
                        )
                );

            } else {

                missingSkills.add(
                        jobSkill.getSkill().getSkillName()
                );
            }
        }

        BigDecimal finalScore =
                totalScore.setScale(
                        2,
                        RoundingMode.HALF_UP
                );

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException("Job not found"));

        return new MatchExplanationResponse(
                job.getJobId(),
                job.getTitle(),
                finalScore,
                matchedSkills,
                missingSkills
        );
    }
}