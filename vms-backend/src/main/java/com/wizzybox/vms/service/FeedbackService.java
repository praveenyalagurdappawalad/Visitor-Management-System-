package com.wizzybox.vms.service;

import com.wizzybox.vms.dto.FeedbackRequest;
import com.wizzybox.vms.entity.Feedback;
import com.wizzybox.vms.repository.FeedbackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final EmailService emailService;

    public Feedback submit(FeedbackRequest req) {
        Feedback feedback = Feedback.builder()
                .visitorName(req.getVisitorName())
                .department(req.getDepartment())
                .rating(req.getRating())
                .comment(req.getComment())
                .build();

        feedback = feedbackRepository.save(feedback);

        // Send feedback notification email to company
        emailService.sendFeedbackNotification(feedback);

        return feedback;
    }

    public List<Feedback> getAll() {
        return feedbackRepository.findAll();
    }

    public void delete(Long id) {
        feedbackRepository.deleteById(id);
    }

    public Double getAverageRating() {
        Double avg = feedbackRepository.findAverageRating();
        return avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0;
    }
}
