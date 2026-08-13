package com.resumeanalyzer.service;

import com.resumeanalyzer.config.AdzunaConfig;
import com.resumeanalyzer.dto.AdzunaJobResponse;
import com.resumeanalyzer.entity.Job;
import com.resumeanalyzer.entity.Resume;
import com.resumeanalyzer.entity.ResumeSkill;
import com.resumeanalyzer.entity.User;
import com.resumeanalyzer.repo.JobRepository;
import com.resumeanalyzer.repo.ResumeSkillRepository;
import com.resumeanalyzer.repo.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdzunaService {

    private final AdzunaConfig adzunaConfig;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final ResumeSkillRepository resumeSkillRepository;
    private final RestClient restClient;

    public AdzunaService(
            AdzunaConfig adzunaConfig,
            JobRepository jobRepository,
            UserRepository userRepository,
            ResumeSkillRepository resumeSkillRepository
    ) {
        this.adzunaConfig = adzunaConfig;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.resumeSkillRepository = resumeSkillRepository;
        this.restClient = RestClient.builder().build();
    }

    // =========================================================
    // SEARCH ADZUNA JOBS
    // =========================================================

    public AdzunaJobResponse searchJobs(
            String keyword,
            String location,
            int page,
            int resultsPerPage
    ) {

        return restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .scheme("https")
                        .host("api.adzuna.com")
                        .path("/v1/api/jobs/in/search/{page}")
                        .queryParam(
                                "app_id",
                                adzunaConfig.getAppId()
                        )
                        .queryParam(
                                "app_key",
                                adzunaConfig.getAppKey()
                        )
                        .queryParam(
                                "results_per_page",
                                resultsPerPage
                        )
                        .queryParam(
                                "what",
                                keyword
                        )
                        .queryParam(
                                "where",
                                location
                        )
                        .queryParam(
                                "content-type",
                                "application/json"
                        )
                        .build(page)
                )
                .retrieve()
                .body(AdzunaJobResponse.class);
    }

    // =========================================================
    // PERSONALIZED JOBS
    // =========================================================

    public List<Job> getPersonalizedJobs(
            String clerkUserId
    ) {

        // -----------------------------------------------------
        // 1. Find user
        // -----------------------------------------------------

        User user = userRepository
                .findByClerkUserId(clerkUserId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );

        // -----------------------------------------------------
        // 2. Get active resume
        // -----------------------------------------------------

        Resume activeResume =
                user.getActiveResume();

        if (activeResume == null) {
            throw new RuntimeException(
                    "No active resume selected"
            );
        }

        // -----------------------------------------------------
        // 3. Get skills from active resume
        // -----------------------------------------------------

        List<ResumeSkill> resumeSkills =
                resumeSkillRepository
                        .findByResumeResumeId(
                                activeResume.getResumeId()
                        );

        if (resumeSkills == null
                || resumeSkills.isEmpty()) {

            throw new RuntimeException(
                    "No skills found for active resume"
            );
        }

        // -----------------------------------------------------
        // 4. Select strongest skills
        // -----------------------------------------------------

        List<String> skills = resumeSkills
                .stream()
                .filter(resumeSkill ->
                        resumeSkill.getSkill() != null
                                && resumeSkill.getSkill()
                                .getSkillName() != null
                                && !resumeSkill.getSkill()
                                .getSkillName()
                                .isBlank()
                )
                .sorted((a, b) -> {

                    if (a.getConfidence() == null
                            && b.getConfidence() == null) {
                        return 0;
                    }

                    if (a.getConfidence() == null) {
                        return 1;
                    }

                    if (b.getConfidence() == null) {
                        return -1;
                    }

                    return b.getConfidence()
                            .compareTo(
                                    a.getConfidence()
                            );
                })
                .map(resumeSkill ->
                        resumeSkill
                                .getSkill()
                                .getSkillName()
                )
                .distinct()
                .limit(5)
                .toList();

        if (skills.isEmpty()) {
            throw new RuntimeException(
                    "Unable to create job search keywords"
            );
        }

        System.out.println(
                "Personalized resume skills: "
                        + skills
        );

        // -----------------------------------------------------
        // 5. Search each skill separately
        // -----------------------------------------------------

        Map<String, AdzunaJobResponse.AdzunaJob>
                uniqueJobs =
                new LinkedHashMap<>();

        for (String skill : skills) {

            try {

                System.out.println(
                        "Searching jobs for skill: "
                                + skill
                );

                AdzunaJobResponse response =
                        searchJobs(
                                skill,
                                "India",
                                1,
                                5
                        );

                if (response == null
                        || response.results() == null) {
                    continue;
                }

                for (
                        AdzunaJobResponse.AdzunaJob
                                adzunaJob
                        : response.results()
                ) {

                    if (adzunaJob.id() != null) {

                        uniqueJobs.putIfAbsent(
                                adzunaJob.id(),
                                adzunaJob
                        );
                    }
                }

                /*
                 * Stop once we have enough jobs.
                 */
                if (uniqueJobs.size() >= 20) {
                    break;
                }

            } catch (Exception e) {

                System.err.println(
                        "Failed to search jobs for skill "
                                + skill
                                + ": "
                                + e.getMessage()
                );
            }
        }

        // -----------------------------------------------------
        // 6. Convert Adzuna jobs into application Job objects
        // -----------------------------------------------------

        List<Job> jobs = new ArrayList<>();

        for (
                AdzunaJobResponse.AdzunaJob
                        adzunaJob
                : uniqueJobs.values()
        ) {

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

            /*
             * These jobs come from Adzuna,
             * not from application users.
             */
            job.setCreatedBy(null);

            jobs.add(job);
        }

        System.out.println(
                "Personalized jobs found: "
                        + jobs.size()
        );

        return jobs;
    }

    // =========================================================
    // IMPORT JOBS INTO DATABASE
    // =========================================================

    public int importJobs(
            String keyword,
            String location,
            int page,
            int resultsPerPage
    ) {

        AdzunaJobResponse response =
                searchJobs(
                        keyword,
                        location,
                        page,
                        resultsPerPage
                );

        if (response == null
                || response.results() == null) {

            return 0;
        }

        int imported = 0;

        for (
                AdzunaJobResponse.AdzunaJob
                        adzunaJob
                : response.results()
        ) {

            if (adzunaJob.id() == null) {
                continue;
            }

            /*
             * Avoid importing the same external job
             * more than once.
             */
            if (adzunaJob.redirect_url() != null
                    && jobRepository
                    .findByRedirectUrl(
                            adzunaJob.redirect_url()
                    )
                    .isPresent()) {

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
                            ? adzunaJob.location()
                            .display_name()
                            : location
            );

            job.setDescription(
                    adzunaJob.description()
            );

            job.setRedirectUrl(
                    adzunaJob.redirect_url()
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

            job.setCreatedBy(null);

            jobRepository.save(job);

            imported++;
        }

        return imported;
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

    private LocalDateTime parseDate(
            String date
    ) {

        if (date == null) {
            return null;
        }

        try {

            return OffsetDateTime
                    .parse(date)
                    .toLocalDateTime();

        } catch (Exception e) {

            return null;
        }
    }
}