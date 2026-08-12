package com.resumeanalyzer.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "jobs")
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "job_id")
    private Integer jobId;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "company", nullable = false, length = 200)
    private String company;

    @Column(name = "location", length = 150)
    private String location;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "salary", length = 100)
    private String salary;

    @Column(name = "job_type", length = 50)
    private String jobType;

    @Column(name = "posted_date")
    private LocalDateTime postedDate;

    @Column(name = "redirect_url", columnDefinition = "TEXT")
    private String redirectUrl;

    @ManyToOne
    @JoinColumn(name = "created_by", nullable = true)
    private User createdBy;

    public Job() {
    }

    public Integer getJobId() {
        return jobId;
    }

    public void setJobId(Integer jobId) {
        this.jobId = jobId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSalary() {
        return salary;
    }

    public void setSalary(String salary) {
        this.salary = salary;
    }

    public String getJobType() {
        return jobType;
    }

    public void setJobType(String jobType) {
        this.jobType = jobType;
    }

    public LocalDateTime getPostedDate() {
        return postedDate;
    }

    public void setPostedDate(LocalDateTime postedDate) {
        this.postedDate = postedDate;
    }

    public String getRedirectUrl() {
        return redirectUrl;
    }

    public void setRedirectUrl(String redirectUrl) {
        this.redirectUrl = redirectUrl;
    }  

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }
}