package com.seal.hackathon.repository;

import com.seal.hackathon.domain.entity.User;
import com.seal.hackathon.domain.enums.AccountStatus;
import com.seal.hackathon.domain.enums.UserCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    boolean existsByEmailIgnoreCase(String email);

    boolean existsByStudentCodeIgnoreCaseAndUserCategory(String studentCode, UserCategory userCategory);

    Optional<User> findByEmailIgnoreCase(String email);

    Page<User> findByAccountStatus(AccountStatus accountStatus, Pageable pageable);
}
