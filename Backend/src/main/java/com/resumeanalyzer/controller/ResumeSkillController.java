package com.resumeanalyzer.controller;

import com.resumeanalyzer.entity.ResumeSkill;
import com.resumeanalyzer.repo.ResumeSkillRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resumes")
public class ResumeSkillController {

    private final ResumeSkillRepository resumeSkillRepository;

    public ResumeSkillController(
            ResumeSkillRepository resumeSkillRepository) {

        this.resumeSkillRepository =
                resumeSkillRepository;
    }

    // =========================================================
    // GET SKILLS OF A RESUME
    // =========================================================

    @GetMapping("/{resumeId}/skills")
    public List<ResumeSkill> getResumeSkills(
            @PathVariable Integer resumeId) {

        return resumeSkillRepository
                .findByResumeResumeId(resumeId);
    }
}
