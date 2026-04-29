package com.wizzybox.vms.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class OtpService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String fromEmail;

    // In-memory OTP store: email -> {otp, expiry}
    private final Map<String, OtpEntry> otpStore = new ConcurrentHashMap<>();

    private static final int OTP_EXPIRY_SECONDS = 300; // 5 minutes

    public void generateAndSend(String email) {
        String otp = String.format("%06d", new SecureRandom().nextInt(999999));
        Instant expiry = Instant.now().plusSeconds(OTP_EXPIRY_SECONDS);
        otpStore.put(email.toLowerCase(), new OtpEntry(otp, expiry));

        sendOtpEmail(email, otp);
        log.info("OTP generated for {}", email);
    }

    public boolean verify(String email, String otp) {
        OtpEntry entry = otpStore.get(email.toLowerCase());
        if (entry == null) return false;
        if (Instant.now().isAfter(entry.expiry())) {
            otpStore.remove(email.toLowerCase());
            return false;
        }
        if (entry.otp().equals(otp)) {
            otpStore.remove(email.toLowerCase());
            return true;
        }
        return false;
    }

    private void sendOtpEmail(String email, String otp) {
        try {
            MimeMessage msg = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(msg, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(email);
            helper.setSubject("Wizzybox VMS — Your OTP Code");
            helper.setText(buildOtpHtml(otp), true);
            mailSender.send(msg);
            log.info("OTP email sent to {}", email);
        } catch (Exception e) {
            log.error("Failed to send OTP email: {}", e.getMessage());
        }
    }

    private String buildOtpHtml(String otp) {
        return "<html><body style='font-family:Arial,sans-serif;max-width:480px;margin:0 auto;'>"
            + "<div style='background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:28px;text-align:center;border-radius:12px 12px 0 0;'>"
            + "<h1 style='color:white;margin:0;font-size:20px;'>Wizzybox VMS</h1>"
            + "<p style='color:rgba(255,255,255,0.8);margin:6px 0 0;font-size:13px;'>Password Reset OTP</p>"
            + "</div>"
            + "<div style='background:white;padding:32px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb;border-top:none;'>"
            + "<p style='color:#1e293b;font-size:15px;margin:0 0 20px;'>Use the OTP below to reset your admin password:</p>"
            + "<div style='background:#f0f4ff;border:2px dashed #4f46e5;border-radius:12px;padding:20px;text-align:center;margin-bottom:20px;'>"
            + "<div style='font-size:40px;font-weight:900;letter-spacing:12px;color:#4f46e5;'>" + otp + "</div>"
            + "<p style='margin:8px 0 0;color:#64748b;font-size:12px;'>Valid for 5 minutes</p>"
            + "</div>"
            + "<p style='color:#94a3b8;font-size:12px;margin:0;'>If you did not request this, please ignore this email.</p>"
            + "</div>"
            + "</body></html>";
    }

    private record OtpEntry(String otp, Instant expiry) {}
}
