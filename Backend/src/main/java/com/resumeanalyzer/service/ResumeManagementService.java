package com.resumeanalyzer.service;

import com.resumeanalyzer.dto.ResumeListResponse;
import com.resumeanalyzer.entity.Resume;
import com.resumeanalyzer.entity.User;
import com.resumeanalyzer.repo.ResumeRepository;
import com.resumeanalyzer.repo.UserRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResumeManagementService {

    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;

    public ResumeManagementService(
            ResumeRepository resumeRepository,
            UserRepository userRepository) {

        this.resumeRepository = resumeRepository;
        this.userRepository = userRepository;
    }

    // =========================================================
    // GET SINGLE RESUME
    // =========================================================

    public Resume getResume(Integer resumeId) {

        return resumeRepository.findById(resumeId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Resume not found"
                        )
                );
    }

    // =========================================================
    // GET USER RESUMES
    // =========================================================

    public List<ResumeListResponse> getUserResumes(
            String clerkUserId) {

        User user = userRepository
                .findByClerkUserId(clerkUserId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );

        final Integer activeResumeId =
                user.getActiveResume() != null
                        ? user.getActiveResume().getResumeId()
                        : null;

        return resumeRepository
                .findByUser(user)
                .stream()
                .map(resume ->
                        new ResumeListResponse(
                                resume.getResumeId(),
                                resume.getFileName(),
                                resume.getUploadedAt(),
                                resume.getResumeId()
                                        .equals(activeResumeId)
                        )
                )
                .toList();
    }

    // =========================================================
    // DELETE RESUME
    // =========================================================

    public void deleteResume(Integer resumeId) {

        Resume resume =
                resumeRepository.findById(resumeId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Resume not found"
                                )
                        );

        resumeRepository.delete(resume);
    }

    // =========================================================
    // SET ACTIVE RESUME
    // =========================================================

    public void setActiveResume(
            String clerkUserId,
            Integer resumeId) {

        User user = userRepository
                .findByClerkUserId(clerkUserId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );

        Resume resume = resumeRepository
                .findById(resumeId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Resume not found"
                        )
                );

        if (!resume.getUser()
                .getUserId()
                .equals(user.getUserId())) {

            throw new RuntimeException(
                    "Resume does not belong to user"
            );
        }

        user.setActiveResume(resume);

        userRepository.save(user);
    }
}