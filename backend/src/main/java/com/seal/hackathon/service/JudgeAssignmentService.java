package com.seal.hackathon.service;

import com.seal.hackathon.domain.entity.Round;
import com.seal.hackathon.domain.entity.Track;
import com.seal.hackathon.domain.entity.User;
import com.seal.hackathon.domain.entity.UserRoleAssignment;
import com.seal.hackathon.domain.enums.RoleName;
import com.seal.hackathon.domain.enums.ScopeType;
import com.seal.hackathon.dto.scoring.JudgeAssignmentRequest;
import com.seal.hackathon.dto.scoring.MentorAssignmentRequest;
import com.seal.hackathon.exception.ApiException;
import com.seal.hackathon.repository.RoundRepository;
import com.seal.hackathon.repository.TrackRepository;
import com.seal.hackathon.repository.UserRepository;
import com.seal.hackathon.repository.UserRoleAssignmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class JudgeAssignmentService {

    private final UserRoleAssignmentRepository roleAssignmentRepository;
    private final UserRepository userRepository;
    private final TrackRepository trackRepository;
    private final RoundRepository roundRepository;
    private final RoundService roundService;

    public JudgeAssignmentService(
            UserRoleAssignmentRepository roleAssignmentRepository,
            UserRepository userRepository,
            TrackRepository trackRepository,
            RoundRepository roundRepository,
            RoundService roundService
    ) {
        this.roleAssignmentRepository = roleAssignmentRepository;
        this.userRepository = userRepository;
        this.trackRepository = trackRepository;
        this.roundRepository = roundRepository;
        this.roundService = roundService;
    }

    @Transactional
    public void assignJudge(UUID roundId, JudgeAssignmentRequest request) {
        Round round = roundService.findOrThrow(roundId);
        User judge = userRepository.findById(request.judgeUserId())
                .orElseThrow(() -> ApiException.notFound("Không tìm thấy giám khảo"));

        if (roleAssignmentRepository.existsByUserIdAndRoleNameAndScopeTypeAndScopeId(
                judge.getId(), RoleName.JUDGE, ScopeType.ROUND, roundId)) {
            throw ApiException.conflict("Giám khảo đã được phân công cho vòng thi này");
        }

        // BR-03: Phong ngua xung dot loi ich - Khong duoc lam Giam khao neu dang la Mentor trong cung su kien
        if (round.getEvent() != null && round.getEvent().getId() != null) {
            List<UUID> trackIds = trackRepository.findByEventId(round.getEvent().getId())
                    .stream().map(Track::getId).toList();
            if (!trackIds.isEmpty() && roleAssignmentRepository.existsByUserIdAndRoleNameAndScopeTypeAndScopeIdIn(
                    judge.getId(), RoleName.MENTOR, ScopeType.TRACK, trackIds)) {
                throw ApiException.conflict("Người dùng đang là Mentor trong sự kiện này, không thể phân công làm Giám khảo");
            }
        }

        UserRoleAssignment assignment = UserRoleAssignment.builder()
                .user(judge)
                .roleName(RoleName.JUDGE)
                .scopeType(ScopeType.ROUND)
                .scopeId(roundId)
                .judgeType(request.judgeType())
                .build();
        roleAssignmentRepository.save(assignment);
    }

    @Transactional(readOnly = true)
    public List<UUID> listJudgeIdsForRound(UUID roundId) {
        return roleAssignmentRepository.findByRoleNameAndScopeTypeAndScopeId(RoleName.JUDGE, ScopeType.ROUND, roundId)
                .stream().map(a -> a.getUser().getId()).collect(Collectors.toList());
    }

    @Transactional
    public void assignMentor(UUID trackId, MentorAssignmentRequest request) {
        Track track = trackRepository.findById(trackId)
                .orElseThrow(() -> ApiException.notFound("Không tìm thấy Hạng mục"));
        User mentor = userRepository.findById(request.mentorUserId())
                .orElseThrow(() -> ApiException.notFound("Không tìm thấy giảng viên"));

        if (roleAssignmentRepository.existsByUserIdAndRoleNameAndScopeTypeAndScopeId(
                mentor.getId(), RoleName.MENTOR, ScopeType.TRACK, trackId)) {
            throw ApiException.conflict("Giảng viên đã là Mentor của Hạng mục này");
        }

        // BR-03: Phong ngua xung dot loi ich - Khong duoc lam Mentor neu dang la Giam khao trong cung su kien
        if (track.getEvent() != null && track.getEvent().getId() != null) {
            List<UUID> roundIds = roundRepository.findByEventIdOrderByOrderIndexAsc(track.getEvent().getId())
                    .stream().map(Round::getId).toList();
            if (!roundIds.isEmpty() && roleAssignmentRepository.existsByUserIdAndRoleNameAndScopeTypeAndScopeIdIn(
                    mentor.getId(), RoleName.JUDGE, ScopeType.ROUND, roundIds)) {
                throw ApiException.conflict("Người dùng đang là Giám khảo trong sự kiện này, không thể phân công làm Mentor");
            }
        }

        UserRoleAssignment assignment = UserRoleAssignment.builder()
                .user(mentor)
                .roleName(RoleName.MENTOR)
                .scopeType(ScopeType.TRACK)
                .scopeId(trackId)
                .build();
        roleAssignmentRepository.save(assignment);
    }

    public boolean isJudgeAssignedToRound(UUID judgeId, UUID roundId) {
        return roleAssignmentRepository.existsByUserIdAndRoleNameAndScopeTypeAndScopeId(
                judgeId, RoleName.JUDGE, ScopeType.ROUND, roundId);
    }
}
