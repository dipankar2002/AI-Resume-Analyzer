package com.resumeanalyzer.entity;

import jakarta.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;

@Entity
@Table(name = "resume_skills")
public class ResumeSkill {

    @EmbeddedId
    private ResumeSkillId id;

    @ManyToOne
    @MapsId("resumeId")
    @JoinColumn(name = "resume_id")
    private Resume resume;

    @ManyToOne
    @MapsId("skillId")
    @JoinColumn(name = "skill_id")
    private Skill skill;

    @Column(name = "confidence", precision = 5, scale = 2)
    private BigDecimal confidence;

    public ResumeSkill() {
    }

    public ResumeSkillId getId() {
        return id;
    }

    public void setId(ResumeSkillId id) {
        this.id = id;
    }

    public Resume getResume() {
        return resume;
    }

    public void setResume(Resume resume) {
        this.resume = resume;
    }

    public Skill getSkill() {
        return skill;
    }

    public void setSkill(Skill skill) {
        this.skill = skill;
    }

    public BigDecimal getConfidence() {
        return confidence;
    }

    public void setConfidence(BigDecimal confidence) {
        this.confidence = confidence;
    }
}