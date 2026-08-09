package com.resumeanalyzer.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.resumeanalyzer.entity.User;

public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}