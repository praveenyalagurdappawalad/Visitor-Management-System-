package com.wizzybox.vms.service;

import com.wizzybox.vms.entity.Feedback;
import com.wizzybox.vms.entity.Visitor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String fromEmail;

    @Value("${app.mail.company}")
    private String companyEmail;

    private static final DateTimeFormatter FMT =
            DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a");

    // ── Visitor Check-in Notification ─────────────────────
    @Async
    public void sendCheckInNotification(Visitor visitor) {
        try {
            String time = visitor.getCheckInTime() != null
                    ? visitor.getCheckInTime().format(FMT) : "-";

            MimeMessage msg = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(msg, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(companyEmail);
            helper.setSubject("New Visitor Check-in: " + visitor.getName());
            helper.setText(buildCheckInHtml(visitor, time), true);

            mailSender.send(msg);
            log.info("Check-in email sent for: {}", visitor.getName());
        } catch (Exception e) {
            log.error("Failed to send check-in email: {}", e.getMessage());
        }
    }

    // ── Feedback Notification ──────────────────────────────
    @Async
    public void sendFeedbackNotification(Feedback feedback) {
        try {
            String time = feedback.getSubmittedAt() != null
                    ? feedback.getSubmittedAt().format(FMT) : "-";

            MimeMessage msg = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(msg, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(companyEmail);
            helper.setSubject("New Feedback: " + feedback.getVisitorName() + " - " + feedback.getRating() + "/5 stars");
            helper.setText(buildFeedbackHtml(feedback, time), true);

            mailSender.send(msg);
            log.info("Feedback email sent for: {}", feedback.getVisitorName());
        } catch (Exception e) {
            log.error("Failed to send feedback email: {}", e.getMessage());
        }
    }

    // ── HTML Templates ─────────────────────────────────────

    private String buildCheckInHtml(Visitor visitor, String time) {
        return "<html><body style='font-family:Arial,sans-serif;max-width:600px;margin:0 auto;'>"
            + "<div style='background:#4f46e5;padding:24px;text-align:center;'>"
            + "<h1 style='color:white;margin:0;font-size:22px;'>Wizzybox VMS</h1>"
            + "<p style='color:rgba(255,255,255,0.8);margin:6px 0 0;font-size:13px;'>New Visitor Check-in</p>"
            + "</div>"
            + "<div style='background:white;padding:28px;'>"
            + "<h2 style='color:#1e1b4b;font-size:18px;margin:0 0 20px;'>A visitor has arrived!</h2>"
            + "<table style='width:100%;border-collapse:collapse;'>"
            + row("Visitor Name", visitor.getName())
            + row("Mobile", visitor.getMobile())
            + row("Department", visitor.getDepartment())
            + row("Purpose", visitor.getPurpose())
            + row("Meeting", visitor.getHost())
            + row("Check-in Time", time)
            + "</table>"
            + "<div style='margin-top:20px;background:#eff6ff;border-left:4px solid #4f46e5;padding:14px 18px;border-radius:6px;'>"
            + "<p style='margin:0;color:#1e40af;font-size:14px;font-weight:600;'>Action Required</p>"
            + "<p style='margin:6px 0 0;color:#3730a3;font-size:13px;'>Please proceed to the reception to receive your visitor.</p>"
            + "</div>"
            + "<div style='margin-top:24px;text-align:center;'>"
            + "<a href='http://localhost:5173/waiting' style='display:inline-block;background:#4f46e5;color:white;text-decoration:none;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:700;margin-right:10px;'>View Waiting List</a>"
            + "<a href='http://localhost:5173/admin' style='display:inline-block;background:#f1f5f9;color:#1e293b;text-decoration:none;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:600;border:1px solid #e2e8f0;'>Admin Dashboard</a>"
            + "</div>"
            + "</div>"
            + "<div style='background:#f8f9fc;padding:16px;text-align:center;border-top:1px solid #e5e7eb;'>"
            + "<p style='margin:0;color:#94a3b8;font-size:12px;'>Wizzybox VMS - Powered by NammaQA Training Center</p>"
            + "<p style='margin:4px 0 0;'><a href='http://localhost:5173' style='color:#4f46e5;font-size:12px;text-decoration:none;'>Open Wizzybox VMS</a></p>"
            + "</div>"
            + "</body></html>";
    }

    private String buildFeedbackHtml(Feedback feedback, String time) {
        String stars = "*".repeat(feedback.getRating()) + " (" + feedback.getRating() + "/5)";
        String[] labels = {"", "Poor", "Fair", "Good", "Very Good", "Excellent"};
        String label = feedback.getRating() >= 1 && feedback.getRating() <= 5
                ? labels[feedback.getRating()] : "";
        String comment = (feedback.getComment() != null && !feedback.getComment().isBlank())
                ? feedback.getComment() : "No comment provided";

        return "<html><body style='font-family:Arial,sans-serif;max-width:600px;margin:0 auto;'>"
            + "<div style='background:#7c3aed;padding:24px;text-align:center;'>"
            + "<h1 style='color:white;margin:0;font-size:22px;'>Wizzybox VMS</h1>"
            + "<p style='color:rgba(255,255,255,0.8);margin:6px 0 0;font-size:13px;'>New Visitor Feedback</p>"
            + "</div>"
            + "<div style='background:white;padding:28px;'>"
            + "<h2 style='color:#1e1b4b;font-size:18px;margin:0 0 20px;'>Feedback from " + feedback.getVisitorName() + "</h2>"
            + "<div style='background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:16px;text-align:center;margin-bottom:20px;'>"
            + "<div style='font-size:24px;font-weight:800;color:#92400e;'>" + stars + "</div>"
            + "<div style='font-size:16px;font-weight:700;color:#b45309;margin-top:4px;'>" + label + "</div>"
            + "</div>"
            + "<table style='width:100%;border-collapse:collapse;'>"
            + row("Visitor", feedback.getVisitorName())
            + row("Department", feedback.getDepartment())
            + row("Rating", feedback.getRating() + " / 5")
            + row("Submitted At", time)
            + "</table>"
            + "<div style='margin-top:20px;background:#f8f9fc;border-left:4px solid #7c3aed;padding:14px 18px;border-radius:6px;'>"
            + "<p style='margin:0 0 6px;color:#64748b;font-size:11px;font-weight:700;text-transform:uppercase;'>Comment</p>"
            + "<p style='margin:0;color:#1e293b;font-size:14px;line-height:1.6;'>" + comment + "</p>"
            + "</div>"
            + "<div style='margin-top:24px;text-align:center;'>"
            + "<a href='http://localhost:5173/admin' style='display:inline-block;background:#7c3aed;color:white;text-decoration:none;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:700;margin-right:10px;'>View All Feedback</a>"
            + "<a href='http://localhost:5173' style='display:inline-block;background:#f1f5f9;color:#1e293b;text-decoration:none;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:600;border:1px solid #e2e8f0;'>Go to Home</a>"
            + "</div>"
            + "</div>"
            + "<div style='background:#f8f9fc;padding:16px;text-align:center;border-top:1px solid #e5e7eb;'>"
            + "<p style='margin:0;color:#94a3b8;font-size:12px;'>Wizzybox VMS - Powered by NammaQA Training Center</p>"
            + "<p style='margin:4px 0 0;'><a href='http://localhost:5173' style='color:#7c3aed;font-size:12px;text-decoration:none;'>Open Wizzybox VMS</a></p>"
            + "</div>"
            + "</body></html>";
    }

    private String row(String label, String value) {
        return "<tr>"
            + "<td style='padding:10px 0;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:13px;width:40%;'><strong>" + label + "</strong></td>"
            + "<td style='padding:10px 0;border-bottom:1px solid #f1f5f9;color:#1e293b;font-size:13px;font-weight:600;'>" + value + "</td>"
            + "</tr>";
    }
}
