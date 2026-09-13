package com.sealhackathon.coordinator.stub;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * TẠM THỜI — Mentor và Judge là domain thuộc module khác (chưa có trong phạm vi P3).
 * Frontend (TracksTab/RoundsTab) cần 2 endpoint này để hiển thị danh sách chọn
 * mentor/giám khảo mà không bị lỗi 404/500. Trả về rỗng cho tới khi module
 * Mentor/Judge thật được tích hợp — lúc đó XOÁ CONTROLLER NÀY và trỏ frontend
 * sang endpoint thật của module đó.
 */
@RestController
@RequestMapping("/api/coordinator/directory")
public class DirectoryController {

    @GetMapping("/mentors")
    public List<Map<String, Object>> listMentors() {
        return List.of();
    }

    @GetMapping("/judges")
    public List<Map<String, Object>> listJudges() {
        return List.of();
    }
}
