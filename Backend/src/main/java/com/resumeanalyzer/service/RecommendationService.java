package com.resumeanalyzer.service;

import com.resumeanalyzer.dto.JobRecommendationResponse;
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

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        if (user.getActiveResume() == null) {
            throw new RuntimeException(
                    "No active resume selected"
            );
        }

        Integer resumeId =
                user.getActiveResume().getResumeId();

        List<Job> jobs = jobRepository.findAll();

        return jobs.stream()
                .map(job -> {

                    BigDecimal score =
                            matchingService.calculateMatchScore(
                                    resumeId,
                                    job.getJobId()
                            );

                    return new JobRecommendationResponse(
                            job.getJobId(),
                            job.getTitle(),
                            job.getCompany(),
                            job.getLocation(),
                            job.getSalary(),
                            job.getJobType(),
                            score
                    );
                })
                .sorted(
                        Comparator.comparing(
                                JobRecommendationResponse::matchScore
                        ).reversed()
                )
                .toList();
    }
}