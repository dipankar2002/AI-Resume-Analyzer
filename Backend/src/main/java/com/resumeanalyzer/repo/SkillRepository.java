package com.resumeanalyzer.repo;

import com.resumeanalyzer.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SkillRepository extends JpaRepository<Skill, Integer> {

    Optional<Skill> findBySkillNameIgnoreCase(String skillName);
}