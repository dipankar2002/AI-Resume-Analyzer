package com.resumeanalyzer.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record AdzunaJobResponse(
        Integer count,
        List<AdzunaJob> results
) {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record AdzunaJob(
            String id,
            String title,
            String description,
            String created,
            String redirect_url,
            Company company,
            Location location,
            String contract_time,
            Double salary_min,
            Double salary_max
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Company(
            String display_name
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Location(
            String display_name
    ) {}
}