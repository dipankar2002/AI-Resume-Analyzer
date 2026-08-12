package com.resumeanalyzer.service;

import com.resumeanalyzer.config.AdzunaConfig;
import com.resumeanalyzer.dto.AdzunaJobResponse;
import com.resumeanalyzer.entity.Job;
import com.resumeanalyzer.repo.JobRepository;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;

@Service
public class AdzunaService {

    private final AdzunaConfig adzunaConfig;
    private final JobRepository jobRepository;
    private final RestClient restClient;

    public AdzunaService(
            AdzunaConfig adzunaConfig,
            JobRepository jobRepository
    ) {
        this.adzunaConfig = adzunaConfig;
        this.jobRepository = jobRepository;
        this.restClient = RestClient.builder().build();
    }

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
                        .queryParam("app_id", adzunaConfig.getAppId())
                        .queryParam("app_key", adzunaConfig.getAppKey())
                        .queryParam("results_per_page", resultsPerPage)
                        .queryParam("what", keyword)
                        .queryParam("where", location)
                        .queryParam("content-type", "application/json")
                        .build(page)
                )
                .retrieve()
                .body(AdzunaJobResponse.class);
    }

    public int importJobs(
            String keyword,
            String location,
            int page,
            int resultsPerPage
    ) {

        AdzunaJobResponse response =
                searchJobs(keyword, location, page, resultsPerPage);

        if (response == null || response.results() == null) {
            return 0;
        }

        int imported = 0;

        for (AdzunaJobResponse.AdzunaJob adzunaJob : response.results()) {

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
                            && adzunaJob.company().display_name() != null
                            ? adzunaJob.company().display_name()
                            : "Unknown Company"
            );

            job.setLocation(
                    adzunaJob.location() != null
                            ? adzunaJob.location().display_name()
                            : location
            );

            job.setDescription(adzunaJob.description());

            job.setRedirectUrl(adzunaJob.redirect_url());

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
                    parseDate(adzunaJob.created())
            );

            /*
             * Adzuna jobs are external jobs,
             * so they are not created by one of
             * the application's users.
             */
            job.setCreatedBy(null);

            jobRepository.save(job);

            imported++;
        }

        return imported;
    }

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

    private LocalDateTime parseDate(String date) {

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