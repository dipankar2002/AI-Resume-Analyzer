package com.resumeanalyzer.service;

import java.io.IOException;
import java.io.InputStream;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.resumeanalyzer.entity.Resume;
import com.resumeanalyzer.entity.User;
import com.resumeanalyzer.repo.ResumeRepository;
import com.resumeanalyzer.repo.UserRepository;

@Service
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;

    public ResumeService(
            ResumeRepository resumeRepository,
            UserRepository userRepository) {

        this.resumeRepository = resumeRepository;
        this.userRepository = userRepository;
    }

    public Resume uploadResume(
            MultipartFile file,
            Integer userId) throws IOException {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        String extractedText = extractText(file);

        Resume resume = new Resume();

        resume.setUser(user);
        resume.setFileName(file.getOriginalFilename());
        resume.setFileData(file.getBytes());
        resume.setExtractedText(extractedText);

        return resumeRepository.save(resume);
    }

    public String extractText(
            MultipartFile file) throws IOException {

        try (
            InputStream inputStream = file.getInputStream();
            PDDocument document =
                    Loader.loadPDF(inputStream.readAllBytes())
        ) {

            PDFTextStripper stripper =
                    new PDFTextStripper();

            return stripper.getText(document);
        }
    }
}