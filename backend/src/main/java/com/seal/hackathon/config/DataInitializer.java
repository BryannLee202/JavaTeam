package com.seal.hackathon.config;

import com.seal.hackathon.domain.entity.User;
import com.seal.hackathon.domain.entity.UserRoleAssignment;
import com.seal.hackathon.domain.enums.AccountStatus;
import com.seal.hackathon.domain.enums.RoleName;
import com.seal.hackathon.domain.enums.ScopeType;
import com.seal.hackathon.domain.enums.UserCategory;
import com.seal.hackathon.repository.UserRepository;
import com.seal.hackathon.repository.UserRoleAssignmentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    @Bean
    public CommandLineRunner initDefaultData(
            UserRepository userRepository,
            UserRoleAssignmentRepository roleAssignmentRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {
            if (!userRepository.existsByEmailIgnoreCase("coordinator@seal.edu.vn")) {
                User coordinator = User.builder()
                        .fullName("Ban Tổ Chức SEAL Hackathon")
                        .email("coordinator@seal.edu.vn")
                        .passwordHash(passwordEncoder.encode("Coordinator@123"))
                        .userCategory(UserCategory.STAFF)
                        .accountStatus(AccountStatus.APPROVED)
                        .guestJudge(false)
                        .build();
                coordinator = userRepository.save(coordinator);

                UserRoleAssignment assignment = UserRoleAssignment.builder()
                        .user(coordinator)
                        .roleName(RoleName.COORDINATOR)
                        .scopeType(ScopeType.GLOBAL)
                        .scopeId(null)
                        .build();
                roleAssignmentRepository.save(assignment);

                log.info(">>> Khoi tao thanh cong tai khoan Coordinator: coordinator@seal.edu.vn / Coordinator@123");
            }
        };
    }
}

