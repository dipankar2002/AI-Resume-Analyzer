package com.resumeanalyzer.controller;

import com.resumeanalyzer.dto.AdzunaJobResponse;
import com.resumeanalyzer.service.AdzunaService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/adzuna")
public class AdzunaController {

    private final AdzunaService adzunaService;

    public AdzunaController(AdzunaService adzunaService) {
        this.adzunaService = adzunaService;
    }

    // Test/search Adzuna
    @GetMapping("/search")
    public AdzunaJobResponse searchJobs(
            @RequestParam String keyword,
            @RequestParam String location
    ) {
        return adzunaService.searchJobs(
                keyword,
                location,
                1,
                5
        );
    }

    // Import Adzuna jobs into MySQL
    @PostMapping("/import")
    public String importJobs(
            @RequestParam String keyword,
            @RequestParam String location
    ) {

        int imported = adzunaService.importJobs(
                keyword,
                location,
                1,
                5
        );

        return imported + " jobs imported successfully.";
    }
}