package com.wizzybox.vms.controller;

import com.wizzybox.vms.dto.FeedbackRequest;
import com.wizzybox.vms.entity.Feedback;
import com.wizzybox.vms.service.FeedbackService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class FeedbackController {

    private final FeedbackService feedbackService;

    // POST /api/feedback
    @PostMapping
    public ResponseEntity<Feedback> submit(@RequestBody @Valid FeedbackRequest req) {
        return ResponseEntity.ok(feedbackService.submit(req));
    }

    // GET /api/feedback
    @GetMapping
    public ResponseEntity<List<Feedback>> getAll() {
        return ResponseEntity.ok(feedbackService.getAll());
    }

    // DELETE /api/feedback/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        feedbackService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // GET /api/feedback/stats
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(Map.of(
            "total",     feedbackService.getAll().size(),
            "avgRating", feedbackService.getAverageRating()
        ));
    }
}
