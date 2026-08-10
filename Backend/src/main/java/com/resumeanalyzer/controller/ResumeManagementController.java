package com.resumeanalyzer.controller;

import com.resumeanalyzer.dto.ResumeListResponse;
import com.resumeanalyzer.service.ResumeManagementService;
import org.springframework.web.bind.annotation.*;
import com.resumeanalyzer.entity.Resume;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import java.util.List;

@RestController
@RequestMapping("/api/resumes")
public class ResumeManagementController {

    private final ResumeManagementService resumeManagementService;

    public ResumeManagementController(
            ResumeManagementService resumeManagementService) {

        this.resumeManagementService = resumeManagementService;
    }
    
    @GetMapping("/user/{userId}")
    public List<ResumeListResponse> getUserResumes(
            @PathVariable Integer userId) {

        return resumeManagementService.getUserResumes(userId);
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

        return ResponseEntity.ok("Resume deleted successfully");
    }
    @PutMapping("/user/{userId}/active/{resumeId}")
    public ResponseEntity<String> setActiveResume(
            @PathVariable Integer userId,
            @PathVariable Integer resumeId) {

        resumeManagementService.setActiveResume(
                userId,
                resumeId
        );

        return ResponseEntity.ok(
                "Active resume updated successfully"
        );
    }
}