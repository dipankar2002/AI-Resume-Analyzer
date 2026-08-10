package com.resumeanalyzer.entity;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class ResumeSkillId implements Serializable {

    private Integer resumeId;
    private Integer skillId;

    public ResumeSkillId() {
    }

    public ResumeSkillId(Integer resumeId, Integer skillId) {
        this.resumeId = resumeId;
        this.skillId = skillId;
    }

    public Integer getResumeId() {
        return resumeId;
    }

    public void setResumeId(Integer resumeId) {
        this.resumeId = resumeId;
    }

    public Integer getSkillId() {
        return skillId;
    }

    public void setSkillId(Integer skillId) {
        this.skillId = skillId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ResumeSkillId)) return false;

        ResumeSkillId that = (ResumeSkillId) o;

        return Objects.equals(resumeId, that.resumeId)
                && Objects.equals(skillId, that.skillId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(resumeId, skillId);
    }
}