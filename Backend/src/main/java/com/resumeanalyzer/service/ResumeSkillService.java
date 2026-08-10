package com.resumeanalyzer.service;

import com.resumeanalyzer.entity.Resume;
import com.resumeanalyzer.entity.ResumeSkill;
import com.resumeanalyzer.entity.ResumeSkillId;
import com.resumeanalyzer.entity.Skill;
import com.resumeanalyzer.repo.ResumeRepository;
import com.resumeanalyzer.repo.ResumeSkillRepository;
import com.resumeanalyzer.repo.SkillRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import com.resumeanalyzer.service.GeminiService;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ResumeSkillService {

    private final ResumeRepository resumeRepository;
    private final SkillRepository skillRepository;
    private final ResumeSkillRepository resumeSkillRepository;

    public ResumeSkillService(
            ResumeRepository resumeRepository,
            SkillRepository skillRepository,
            ResumeSkillRepository resumeSkillRepository) {

        this.resumeRepository = resumeRepository;
        this.skillRepository = skillRepository;
        this.resumeSkillRepository = resumeSkillRepository;
    }

    public void saveSkills(
            Integer resumeId,
            List<GeminiService.ExtractedSkill> extractedSkills) {

        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        for (GeminiService.ExtractedSkill extractedSkill : extractedSkills) {

            String skillName = extractedSkill.skill().trim();

            Skill skill = skillRepository
                    .findBySkillNameIgnoreCase(skillName)
                    .orElseGet(() -> {
                        Skill newSkill = new Skill();
                        newSkill.setSkillName(skillName);
                        return skillRepository.save(newSkill);
                    });

            ResumeSkillId id = new ResumeSkillId(
                    resume.getResumeId(),
                    skill.getSkillId()
            );

            ResumeSkill resumeSkill = new ResumeSkill();

            resumeSkill.setId(id);
            resumeSkill.setResume(resume);
            resumeSkill.setSkill(skill);

            // Store Gemini's confidence score
            resumeSkill.setConfidence(extractedSkill.confidence());

            resumeSkillRepository.save(resumeSkill);
        }
    }
}