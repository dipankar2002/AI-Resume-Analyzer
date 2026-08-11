package com.resumeanalyzer.repo;

import com.resumeanalyzer.entity.ResumeSkill;
import com.resumeanalyzer.entity.ResumeSkillId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResumeSkillRepository
        extends JpaRepository<ResumeSkill, ResumeSkillId> {

    List<ResumeSkill> findByResumeResumeId(Integer resumeId);
}