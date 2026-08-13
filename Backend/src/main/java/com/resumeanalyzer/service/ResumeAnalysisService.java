package com.resumeanalyzer.service;

import com.resumeanalyzer.entity.Resume;
import com.resumeanalyzer.entity.ResumeAnalysis;
import com.resumeanalyzer.repo.ResumeAnalysisRepository;
import com.resumeanalyzer.repo.ResumeRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ResumeAnalysisService {

    private final ResumeRepository resumeRepository;
    private final ResumeAnalysisRepository resumeAnalysisRepository;
    private final GeminiService geminiService;

    public ResumeAnalysisService(
            ResumeRepository resumeRepository,
            ResumeAnalysisRepository resumeAnalysisRepository,
            GeminiService geminiService) {

        this.resumeRepository = resumeRepository;
        this.resumeAnalysisRepository = resumeAnalysisRepository;
        this.geminiService = geminiService;
    }

    public ResumeAnalysis analyzeResume(
            Integer resumeId,
            Integer userId) {

        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() ->
                        new RuntimeException("Resume not found"));

        if (resume.getUser() == null
                || !resume.getUser()
                        .getUserId()
                        .equals(userId)) {

            throw new RuntimeException(
                    "Resume does not belong to this user"
            );
        }

        if (resume.getExtractedText() == null
                || resume.getExtractedText().isBlank()) {

            throw new RuntimeException(
                    "Resume text could not be extracted"
            );
        }

        /*
         * -----------------------------------------------------
         * 1. AI ATS ANALYSIS
         * -----------------------------------------------------
         */

        ResumeAnalysisResponse aiResult =
                geminiService.analyzeResumeContent(
                        resume.getExtractedText()
                );

        /*
         * -----------------------------------------------------
         * 2. EXTRACT AND SAVE RESUME SKILLS
         * -----------------------------------------------------
         *
         * This is required for personalized job matching.
         */

        geminiService.analyzeResume(resumeId);

        /*
         * -----------------------------------------------------
         * 3. SAVE ATS ANALYSIS
         * -----------------------------------------------------
         */

        ResumeAnalysis analysis =
                resumeAnalysisRepository
                        .findByResumeResumeId(resumeId)
                        .orElseGet(ResumeAnalysis::new);

        analysis.setResume(resume);

        analysis.setAtsScore(
                aiResult.atsScore()
        );

        analysis.setProfessionalSummary(
                aiResult.professionalSummary()
        );

        analysis.setStrengths(
                aiResult.strengths() == null
                        ? ""
                        : String.join(
                                "\n",
                                aiResult.strengths()
                        )
        );

        analysis.setWeaknesses(
                aiResult.weaknesses() == null
                        ? ""
                        : String.join(
                                "\n",
                                aiResult.weaknesses()
                        )
        );

        analysis.setSuggestions(
                aiResult.suggestions() == null
                        ? ""
                        : String.join(
                                "\n",
                                aiResult.suggestions()
                        )
        );

        analysis.setAnalyzedAt(
                LocalDateTime.now()
        );

        return resumeAnalysisRepository.save(
                analysis
        );
    }

    public List<ResumeAnalysis> getUserAnalyses(
            Integer userId) {

        return resumeAnalysisRepository
                .findByResumeUserUserId(userId);
    }
}
