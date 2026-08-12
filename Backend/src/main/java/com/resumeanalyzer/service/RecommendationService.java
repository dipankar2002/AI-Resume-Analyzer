package com.resumeanalyzer.service;

import com.resumeanalyzer.dto.JobRecommendationResponse;
import com.resumeanalyzer.dto.MatchExplanationResponse;
import com.resumeanalyzer.entity.Job;
import com.resumeanalyzer.entity.User;
import com.resumeanalyzer.repo.JobRepository;
import com.resumeanalyzer.repo.UserRepository;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;

@Service
public class RecommendationService {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final MatchingService matchingService;

    public RecommendationService(
            UserRepository userRepository,
            JobRepository jobRepository,
            MatchingService matchingService) {

        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.matchingService = matchingService;
    }

    public List<JobRecommendationResponse> getRecommendations(
            Integer userId) {

        User user =
                userRepository.findById(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        if (user.getActiveResume() == null) {

            throw new RuntimeException(
                    "No active resume selected"
            );
        }

        Integer resumeId =
                user.getActiveResume()
                        .getResumeId();

        List<Job> jobs =
                jobRepository.findAll();

        return jobs.stream()
                .map(job -> {

                    /*
                     * Use MatchingService as the SINGLE
                     * source of truth for matching.
                     */
                    MatchExplanationResponse explanation =
                            matchingService.explainMatch(
                                    resumeId,
                                    job.getJobId()
                            );

                    /*
                     * DEBUG
                     * This tells us exactly what score
                     * RecommendationService receives.
                     */
                   

                    BigDecimal score =
                            explanation.matchScore();

                    String matchLevel =
                            explanation.matchLevel();

                    int matchedSkills =
                            explanation.matchedSkills()
                                    .size();

                    int totalJobSkills =
                            matchedSkills
                                    + explanation.missingSkills()
                                            .size();

                    return new JobRecommendationResponse(
                            job.getJobId(),
                            job.getTitle(),
                            job.getCompany(),
                            job.getLocation(),
                            job.getSalary(),
                            job.getJobType(),
                            score,
                            matchLevel,
                            matchedSkills,
                            totalJobSkills
                    );
                })
                .sorted(
                        Comparator.comparing(
                                JobRecommendationResponse
                                        ::matchScore
                        ).reversed()
                )
                .toList();
    }
}