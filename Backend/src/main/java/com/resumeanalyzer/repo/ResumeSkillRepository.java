package com.resumeanalyzer.repo;

import com.resumeanalyzer.entity.ResumeSkill;
import com.resumeanalyzer.entity.ResumeSkillId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResumeSkillRepository
        extends JpaRepository<ResumeSkill, ResumeSkillId> {
}