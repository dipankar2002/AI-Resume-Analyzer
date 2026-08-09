package com.resumeanalyzer.repo;

import com.resumeanalyzer.entity.Resume;
import com.resumeanalyzer.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResumeRepository extends JpaRepository<Resume, Integer> {

    List<Resume> findByUser(User user);
}