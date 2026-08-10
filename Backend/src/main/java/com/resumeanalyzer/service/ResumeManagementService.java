package com.resumeanalyzer.service;

import com.resumeanalyzer.dto.ResumeListResponse;

import com.resumeanalyzer.entity.User;
import com.resumeanalyzer.repo.ResumeRepository;
import com.resumeanalyzer.repo.UserRepository;
import org.springframework.stereotype.Service;
import com.resumeanalyzer.entity.Resume;
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
    public Resume getResume(Integer resumeId) {

        return resumeRepository.findById(resumeId)
                .orElseThrow(() ->
                        new RuntimeException("Resume not found"));
    }
    public List<ResumeListResponse> getUserResumes(Integer userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return resumeRepository.findByUser(user)
                .stream()
                .map(resume -> new ResumeListResponse(
                        resume.getResumeId(),
                        resume.getFileName(),
                        resume.getUploadedAt()
                ))
                .toList();
    }
    public void deleteResume(Integer resumeId) {

        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() ->
                        new RuntimeException("Resume not found"));

        resumeRepository.delete(resume);
    }
    public void setActiveResume(Integer userId, Integer resumeId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() ->
                        new RuntimeException("Resume not found"));

        if (!resume.getUser().getUserId().equals(userId)) {
            throw new RuntimeException(
                    "Resume does not belong to this user"
            );
        }

        user.setActiveResume(resume);

        userRepository.save(user);
    }
}