package com.resumeanalyzer.service;

import com.resumeanalyzer.dto.AdzunaJobResponse;
import com.resumeanalyzer.dto.JobRecommendationResponse;
import com.resumeanalyzer.entity.Job;
import com.resumeanalyzer.entity.ResumeSkill;
import com.resumeanalyzer.entity.User;
import com.resumeanalyzer.repo.ResumeSkillRepository;
import com.resumeanalyzer.repo.UserRepository;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

@Service
public class RecommendationService {

    private final UserRepository userRepository;
    private final ResumeSkillRepository resumeSkillRepository;
    private final AdzunaService adzunaService;

    public RecommendationService(
            UserRepository userRepository,
            ResumeSkillRepository resumeSkillRepository,
            AdzunaService adzunaService
    ) {
        this.userRepository = userRepository;
        this.resumeSkillRepository = resumeSkillRepository;
        this.adzunaService = adzunaService;
    }

    // =========================================================
    // PERSONALIZED RECOMMENDATIONS
    // =========================================================

    public List<JobRecommendationResponse> getRecommendations(
            Integer userId
    ) {

        User user = userRepository
                .findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        if (user.getActiveResume() == null) {
            throw new RuntimeException(
                    "No active resume selected"
            );
        }

        Integer resumeId =
                user.getActiveResume()
                        .getResumeId();

        List<ResumeSkill> resumeSkills =
                resumeSkillRepository
                        .findByResumeResumeId(resumeId);

        if (resumeSkills == null
                || resumeSkills.isEmpty()) {

            throw new RuntimeException(
                    "No skills found for active resume"
            );
        }

        return createRecommendations(
                resumeSkills,
                adzunaService.getPersonalizedJobs(
                        user.getClerkUserId()
                )
        );
    }

    // =========================================================
    // FILTERED JOB SEARCH
    // =========================================================

    public List<JobRecommendationResponse> searchRecommendations(
            Integer userId,
            String keyword,
            String location,
            String jobType
    ) {

        User user = userRepository
                .findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        if (user.getActiveResume() == null) {
            throw new RuntimeException(
                    "No active resume selected"
            );
        }

        Integer resumeId =
                user.getActiveResume()
                        .getResumeId();

        List<ResumeSkill> resumeSkills =
                resumeSkillRepository
                        .findByResumeResumeId(resumeId);

        if (resumeSkills == null
                || resumeSkills.isEmpty()) {

            throw new RuntimeException(
                    "No skills found for active resume"
            );
        }

        String searchKeyword =
                keyword == null
                        ? ""
                        : keyword.trim();

        if (searchKeyword.isBlank()) {
            throw new RuntimeException(
                    "Please enter a job title or skill"
            );
        }

        String searchLocation =
                location == null
                        || location.isBlank()
                        ? "India"
                        : location.trim();

        AdzunaJobResponse response =
                adzunaService.searchJobs(
                        searchKeyword,
                        searchLocation,
                        1,
                        20
                );

        List<Job> jobs =
                convertAdzunaJobs(response);

        if (jobType != null
                && !jobType.isBlank()
                && !jobType.equalsIgnoreCase("all")) {

            String requestedType =
                    jobType.trim()
                            .toLowerCase(Locale.ROOT);

            jobs = jobs.stream()
                    .filter(job ->
                            job.getJobType() != null
                                    && job.getJobType()
                                    .toLowerCase(Locale.ROOT)
                                    .contains(requestedType)
                    )
                    .toList();
        }

        return createRecommendations(
                resumeSkills,
                jobs
        );
    }

    // =========================================================
    // CREATE RECOMMENDATIONS
    // =========================================================

    private List<JobRecommendationResponse> createRecommendations(
            List<ResumeSkill> resumeSkills,
            List<Job> jobs
    ) {

        if (jobs == null || jobs.isEmpty()) {
            return List.of();
        }

        Map<String, BigDecimal> candidateSkills =
                new LinkedHashMap<>();

        for (ResumeSkill resumeSkill : resumeSkills) {

            if (resumeSkill.getSkill() == null) {
                continue;
            }

            String skillName =
                    resumeSkill.getSkill()
                            .getSkillName();

            if (skillName == null
                    || skillName.isBlank()) {
                continue;
            }

            BigDecimal confidence =
                    resumeSkill.getConfidence();

            if (confidence == null) {
                confidence =
                        BigDecimal.valueOf(50);
            }

            candidateSkills.put(
                    normalize(skillName),
                    confidence
            );
        }

        if (candidateSkills.isEmpty()) {
            return List.of();
        }

        List<JobRecommendationResponse> results =
                jobs.stream()
                        .map(job ->
                                createRecommendation(
                                        job,
                                        candidateSkills
                                )
                        )
                        .sorted(
                                Comparator
                                        .comparing(
                                                JobRecommendationResponse
                                                        ::matchScore
                                        )
                                        .reversed()
                        )
                        .toList();

        return results;
    }

    // =========================================================
    // SCORE ONE JOB
    // =========================================================

    private JobRecommendationResponse createRecommendation(
            Job job,
            Map<String, BigDecimal> candidateSkills
    ) {

        String searchableText =
                buildSearchableText(job);

        List<String> matchedSkillNames =
                new ArrayList<>();

        BigDecimal totalWeight =
                BigDecimal.ZERO;

        BigDecimal matchedWeight =
                BigDecimal.ZERO;

        for (
                Map.Entry<String, BigDecimal> entry
                : candidateSkills.entrySet()
        ) {

            String skill =
                    entry.getKey();

            BigDecimal confidence =
                    entry.getValue();

            totalWeight =
                    totalWeight.add(confidence);

            if (containsSkill(
                    searchableText,
                    skill
            )) {

                matchedSkillNames.add(
                        displaySkillName(
                                skill,
                                candidateSkills
                        )
                );

                matchedWeight =
                        matchedWeight.add(
                                confidence
                        );
            }
        }

        double score = 0.0;

        if (totalWeight.compareTo(
                BigDecimal.ZERO
        ) > 0) {

            score =
                    matchedWeight
                            .divide(
                                    totalWeight,
                                    4,
                                    RoundingMode.HALF_UP
                            )
                            .doubleValue()
                            * 100.0;
        }

        score =
                Math.min(
                        100.0,
                        Math.max(
                                0.0,
                                score
                        )
                );

        BigDecimal matchScore =
                BigDecimal.valueOf(score)
                        .setScale(
                                2,
                                RoundingMode.HALF_UP
                        );

        String matchLevel;

        if (score >= 75) {
            matchLevel = "Excellent Match";
        } else if (score >= 50) {
            matchLevel = "Good Match";
        } else if (score >= 25) {
            matchLevel = "Possible Match";
        } else {
            matchLevel = "Low Match";
        }

        return new JobRecommendationResponse(
                job.getJobId(),
                job.getTitle(),
                job.getCompany(),
                job.getLocation(),
                job.getSalary(),
                job.getJobType(),
                job.getRedirectUrl(),
                matchScore,
                matchLevel,
                matchedSkillNames.size(),
                candidateSkills.size(),
                matchedSkillNames
        );
    }

    // =========================================================
    // SKILL MATCHING
    // =========================================================

    private boolean containsSkill(
            String jobText,
            String skill
    ) {

        if (skill == null || skill.isBlank()) {
            return false;
        }

        String normalizedSkill =
                normalize(skill);

        if (jobText.contains(normalizedSkill)) {
            return true;
        }

        return false;
    }

    // =========================================================
    // DISPLAY SKILL NAME
    // =========================================================

    private String displaySkillName(
            String normalizedSkill,
            Map<String, BigDecimal> candidateSkills
    ) {

        for (String skill :
                candidateSkills.keySet()) {

            if (skill.equals(normalizedSkill)) {
                return skill;
            }
        }

        return normalizedSkill;
    }

    // =========================================================
    // BUILD SEARCHABLE TEXT
    // =========================================================

    private String buildSearchableText(
            Job job
    ) {

        String title =
                job.getTitle() != null
                        ? job.getTitle()
                        : "";

        String description =
                job.getDescription() != null
                        ? job.getDescription()
                        : "";

        String company =
                job.getCompany() != null
                        ? job.getCompany()
                        : "";

        return normalize(
                title
                        + " "
                        + description
                        + " "
                        + company
        );
    }

    // =========================================================
    // CONVERT ADZUNA JOBS
    // =========================================================

    private List<Job> convertAdzunaJobs(
            AdzunaJobResponse response
    ) {

        if (response == null
                || response.results() == null) {

            return List.of();
        }

        List<Job> jobs =
                new ArrayList<>();

        for (
                AdzunaJobResponse.AdzunaJob adzunaJob
                : response.results()
        ) {

            if (adzunaJob.id() == null) {
                continue;
            }

            Job job = new Job();

            job.setTitle(
                    adzunaJob.title() != null
                            ? adzunaJob.title()
                            : "Untitled Job"
            );

            job.setCompany(
                    adzunaJob.company() != null
                            && adzunaJob.company()
                            .display_name() != null
                            ? adzunaJob.company()
                            .display_name()
                            : "Unknown Company"
            );

            job.setLocation(
                    adzunaJob.location() != null
                            && adzunaJob.location()
                            .display_name() != null
                            ? adzunaJob.location()
                            .display_name()
                            : "India"
            );

            job.setDescription(
                    adzunaJob.description()
            );

            job.setSalary(
                    buildSalary(
                            adzunaJob.salary_min(),
                            adzunaJob.salary_max()
                    )
            );

            job.setJobType(
                    adzunaJob.contract_time()
            );

            job.setPostedDate(
                    parseDate(
                            adzunaJob.created()
                    )
            );

            job.setRedirectUrl(
                    adzunaJob.redirect_url()
            );

            job.setCreatedBy(null);

            jobs.add(job);
        }

        return jobs;
    }

    // =========================================================
    // SALARY
    // =========================================================

    private String buildSalary(
            Double min,
            Double max
    ) {

        if (min == null && max == null) {
            return null;
        }

        if (min != null && max != null) {
            return min + " - " + max;
        }

        if (min != null) {
            return String.valueOf(min);
        }

        return String.valueOf(max);
    }

    // =========================================================
    // DATE
    // =========================================================

    private java.time.LocalDateTime parseDate(
            String date
    ) {

        if (date == null) {
            return null;
        }

        try {

            return java.time.OffsetDateTime
                    .parse(date)
                    .toLocalDateTime();

        } catch (Exception e) {

            return null;
        }
    }

    // =========================================================
    // NORMALIZE
    // =========================================================

    private String normalize(
            String value
    ) {

        return value
                .toLowerCase(Locale.ROOT)
                .replaceAll(
                        "[^a-z0-9+#.\\- ]",
                        " "
                )
                .replaceAll(
                        "\\s+",
                        " "
                )
                .trim();
    }
}