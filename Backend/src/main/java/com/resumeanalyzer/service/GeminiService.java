package com.resumeanalyzer.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import com.resumeanalyzer.entity.Resume;
import com.resumeanalyzer.repo.ResumeRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class GeminiService {

    private final Client client;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private final ResumeRepository resumeRepository;
    private final ResumeSkillService resumeSkillService;

    public GeminiService(
            ResumeRepository resumeRepository,
            ResumeSkillService resumeSkillService,
            @Value("${GEMINI_API_KEY}") String geminiApiKey) {

        this.client = Client.builder()
                .apiKey(geminiApiKey)
                .build();

        this.resumeRepository = resumeRepository;
        this.resumeSkillService = resumeSkillService;
    }

    public String testGemini() {

        GenerateContentResponse response = client.models.generateContent(
                "gemini-3.6-flash",
                "Say hello in one short sentence.",
                null
        );

        return response.text();
    }

    public List<ExtractedSkill> extractSkills(String resumeText) {

        String prompt = """
                Analyze the following resume and extract the technical and professional skills.

                For every skill, provide a confidence score from 0 to 100.
                The confidence represents how strongly the resume demonstrates that the person has this skill.

                Return ONLY valid JSON.
                Do not use markdown.
                Do not add explanations.

                Required format:
                [
                  {"skill":"Java","confidence":95},
                  {"skill":"Spring Boot","confidence":90}
                ]

                Do not include duplicate skills.

                Resume:
                """ + resumeText;

        GenerateContentResponse response = client.models.generateContent(
                "gemini-3.6-flash",
                prompt,
                null
        );

        try {

            return objectMapper.readValue(
                    response.text(),
                    new TypeReference<List<ExtractedSkill>>() {}
            );

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to parse Gemini skill response",
                    e
            );
        }
    }

    public List<ExtractedSkill> analyzeResume(Integer resumeId) {

        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() ->
                        new RuntimeException("Resume not found"));

        List<ExtractedSkill> skills =
                extractSkills(resume.getExtractedText());

        resumeSkillService.saveSkills(resumeId, skills);

        return skills;
    }

    public ResumeAnalysisResponse analyzeResumeContent(String resumeText) {

        String prompt = """
                Analyze the following resume as an ATS (Applicant Tracking System).

                Evaluate the resume based on:
                - Technical and professional skills
                - Experience and projects
                - Education
                - Resume structure and clarity
                - Keywords relevant to the candidate's profile

                Return ONLY valid JSON.
                Do not use markdown.
                Do not add explanations outside the JSON.

                Required format:
                {
                  "atsScore": 85,
                  "professionalSummary": "A concise professional summary",
                  "strengths": [
                    "Strong Java development skills",
                    "Good project experience"
                  ],
                  "weaknesses": [
                    "Limited cloud experience"
                  ],
                  "suggestions": [
                    "Add measurable achievements",
                    "Mention relevant cloud technologies"
                  ]
                }

                atsScore must be a number from 0 to 100.

                Resume:
                """ + resumeText;

        GenerateContentResponse response = client.models.generateContent(
                "gemini-3.6-flash",
                prompt,
                null
        );

        try {

            return objectMapper.readValue(
                    response.text(),
                    ResumeAnalysisResponse.class
            );

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to parse Gemini ATS analysis",
                    e
            );
        }
    }

    public String getResumeText(Integer resumeId) {

        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() ->
                        new RuntimeException("Resume not found"));

        return resume.getExtractedText();
    }

    public record ExtractedSkill(
            String skill,
            BigDecimal confidence
    ) {
    }
}