package com.resumeanalyzer.service;

import com.resumeanalyzer.dto.AdminJobMatchResponse;
import com.resumeanalyzer.dto.AdminResumeResponse;
import com.resumeanalyzer.dto.MatchExplanationResponse;
import com.resumeanalyzer.entity.Job;
import com.resumeanalyzer.entity.JobSkill;
import com.resumeanalyzer.entity.Resume;
import com.resumeanalyzer.repo.JobRepository;
import com.resumeanalyzer.repo.JobSkillRepository;
import com.resumeanalyzer.repo.ResumeRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class AdminMatchingService {

    private final ResumeRepository resumeRepository;
    private final JobRepository jobRepository;
    private final JobSkillRepository jobSkillRepository;
    private final MatchingService matchingService;

    public AdminMatchingService(
            ResumeRepository resumeRepository,
            JobRepository jobRepository,
            JobSkillRepository jobSkillRepository,
            MatchingService matchingService) {
        this.resumeRepository = resumeRepository;
        this.jobRepository = jobRepository;
        this.jobSkillRepository = jobSkillRepository;
        this.matchingService = matchingService;
    }

    public List<AdminResumeResponse> getResumes() {
        return resumeRepository.findAll().stream()
                .map(this::toResumeResponse)
                .toList();
    }

    public List<AdminJobMatchResponse> getRankedJobMatches(Integer resumeId) {
        if (!resumeRepository.existsById(resumeId)) {
            throw new RuntimeException("Resume not found");
        }

        List<AdminJobMatchResponse> results = new ArrayList<>();

        for (Job job : jobRepository.findAll()) {
            MatchExplanationResponse explanation =
                    matchingService.explainMatch(resumeId, job.getJobId());

            List<JobSkill> jobSkills =
                    jobSkillRepository.findByJobJobId(job.getJobId());

            List<String> requiredSkills = jobSkills.stream()
                    .filter(skill -> skill.getImportance() == JobSkill.Importance.REQUIRED)
                    .map(skill -> skill.getSkill().getSkillName())
                    .toList();

            List<String> matchedSkills = explanation.matchedSkills().stream()
                    .map(skill -> skill.skill())
                    .toList();

            results.add(new AdminJobMatchResponse(
                    0,
                    job.getJobId(),
                    job.getTitle(),
                    job.getCompany(),
                    job.getLocation(),
                    job.getSalary(),
                    job.getJobType(),
                    explanation.matchScore(),
                    requiredSkills,
                    matchedSkills,
                    explanation.missingSkills()
            ));
        }

        results.sort(Comparator.comparing(
                AdminJobMatchResponse::matchScore,
                Comparator.nullsLast(Comparator.reverseOrder())
        ));

        List<AdminJobMatchResponse> ranked = new ArrayList<>();
        for (int i = 0; i < results.size(); i++) {
            AdminJobMatchResponse item = results.get(i);
            ranked.add(new AdminJobMatchResponse(
                    i + 1,
                    item.jobId(),
                    item.title(),
                    item.company(),
                    item.location(),
                    item.salary(),
                    item.jobType(),
                    item.matchScore(),
                    item.requiredSkills(),
                    item.matchedSkills(),
                    item.missingSkills()
            ));
        }

        return ranked;
    }

    private AdminResumeResponse toResumeResponse(Resume resume) {
        return new AdminResumeResponse(
                resume.getResumeId(),
                resume.getUser().getUserId(),
                resume.getUser().getName(),
                resume.getUser().getEmail(),
                resume.getFileName(),
                resume.getUploadedAt()
        );
    }
}
