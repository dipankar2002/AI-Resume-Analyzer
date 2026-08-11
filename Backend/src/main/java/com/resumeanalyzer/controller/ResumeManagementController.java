package com.resumeanalyzer.controller;

import com.resumeanalyzer.dto.ResumeListResponse;
import com.resumeanalyzer.entity.Resume;
import com.resumeanalyzer.service.ResumeManagementService;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resumes")
public class ResumeManagementController {

    private final ResumeManagementService resumeManagementService;

    public ResumeManagementController(
            ResumeManagementService resumeManagementService) {

        this.resumeManagementService = resumeManagementService;
    }

    @GetMapping("/me")
    public List<ResumeListResponse> getUserResumes(
            @AuthenticationPrincipal Jwt jwt) {

        return resumeManagementService.getUserResumes(
                jwt.getSubject()
        );
    }

    @GetMapping("/{resumeId}/download")
    public ResponseEntity<byte[]> downloadResume(
            @PathVariable Integer resumeId) {

        Resume resume =
                resumeManagementService.getResume(resumeId);

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" +
                                resume.getFileName() + "\""
                )
                .contentType(MediaType.APPLICATION_PDF)
                .body(resume.getFileData());
    }

    @DeleteMapping("/{resumeId}")
    public ResponseEntity<String> deleteResume(
            @PathVariable Integer resumeId) {

        resumeManagementService.deleteResume(resumeId);

        return ResponseEntity.ok(
                "Resume deleted successfully"
        );
    }

    @PutMapping("/me/active/{resumeId}")
    public ResponseEntity<String> setActiveResume(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Integer resumeId) {

        resumeManagementService.setActiveResume(
                jwt.getSubject(),
                resumeId
        );

        return ResponseEntity.ok(
                "Active resume updated successfully"
        );
    }
}