package com.sealhackathon.coordinator.stub;

import com.sealhackathon.coordinator.event.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * TẠM THỜI — Submission là domain thuộc module khác (Team/Submission), chưa có
 * trong phạm vi P3. Trả về danh sách rỗng (đúng shape phân trang mà frontend
 * mong đợi) để tab "Bài nộp" không lỗi. XOÁ khi module Submission thật xong.
 */
@RestController
@RequestMapping("/api/coordinator/events/{eventId}/submissions")
@RequiredArgsConstructor
public class SubmissionStubController {

    private final EventService eventService;

    @GetMapping
    public PageResponse<Object> list(
            @PathVariable Long eventId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize
    ) {
        eventService.findEntity(eventId); // 404 đúng nghĩa nếu sự kiện không tồn tại
        return PageResponse.empty(page, pageSize);
    }
}
