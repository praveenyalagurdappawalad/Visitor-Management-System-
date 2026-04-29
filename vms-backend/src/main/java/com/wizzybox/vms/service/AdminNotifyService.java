package com.wizzybox.vms.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminNotifyService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String fromEmail;

    @Value("${app.mail.company}")
    private String companyEmail;

    private static final DateTimeFormatter FMT =
            DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a");

    @Async
    public void sendRegistrationEmail(String name, String username, String email) {
        String time = LocalDateTime.now().format(FMT);
        try {
            MimeMessage msg = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(msg, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(companyEmail);
            helper.setSubject("New Admin Registered — " + name);
            helper.setText(buildRegistrationHtml(name, username, email, time), true);
            mailSender.send(msg);
            log.info("Admin registration email sent for: {}", username);
        } catch (Exception e) {
            log.error("Failed to send registration email: {}", e.getMessage());
        }
    }

    @Async
    public void sendLoginEmail(String name, String username, String email) {
        String time = LocalDateTime.now().format(FMT);
        try {
            MimeMessage msg = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(msg, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(companyEmail);
            helper.setSubject("Admin Login Alert — " + name);
            helper.setText(buildLoginHtml(name, username, email, time), true);
            mailSender.send(msg);
            log.info("Admin login email sent for: {}", username);
        } catch (Exception e) {
            log.error("Failed to send login email: {}", e.getMessage());
        }
    }

    private String buildRegistrationHtml(String name, String username, String email, String time) {
        return "<html><body style='font-family:Arial,sans-serif;max-width:560px;margin:0 auto;'>"
            + "<div style='background:linear-gradient(135deg,#059669,#10b981);padding:28px;text-align:center;border-radius:12px 12px 0 0;'>"
            + "<h1 style='color:white;margin:0;font-size:20px;'>Wizzybox VMS</h1>"
            + "<p style='color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:13px;'>New Admin Registration</p>"
            + "</div>"
            + "<div style='background:white;padding:28px;border:1px solid #e5e7eb;border-top:none;'>"
            + "<h2 style='color:#1e1b4b;font-size:18px;margin:0 0 6px;'>New admin account created</h2>"
            + "<p style='color:#64748b;font-size:13px;margin:0 0 20px;'>A new administrator has registered on Wizzybox VMS.</p>"
            + "<table style='width:100%;border-collapse:collapse;'>"
            + row("Full Name", name)
            + row("Username", username)
            + row("Email", email)
            + row("Registered At", time)
            + "</table>"
            + "<div style='margin-top:20px;background:#ecfdf5;border-left:4px solid #059669;padding:14px 18px;border-radius:6px;'>"
            + "<p style='margin:0;color:#065f46;font-size:13px;font-weight:600;'>Security Notice</p>"
            + "<p style='margin:6px 0 0;color:#047857;font-size:12px;'>If you did not authorize this registration, please review your admin accounts immediately.</p>"
            + "</div>"
            + "<div style='margin-top:20px;text-align:center;'>"
            + "<a href='http://localhost:5173/admin' style='display:inline-block;background:#4f46e5;color:white;text-decoration:none;padding:11px 24px;border-radius:8px;font-size:13px;font-weight:700;'>Open Admin Dashboard</a>"
            + "</div>"
            + "</div>"
            + "<div style='background:#f8f9fc;padding:14px;text-align:center;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;'>"
            + "<p style='margin:0;color:#94a3b8;font-size:11px;'>Wizzybox VMS - Powered by NammaQA Training Center</p>"
            + "</div>"
            + "</body></html>";
    }

    private String buildLoginHtml(String name, String username, String email, String time) {
        return "<html><body style='font-family:Arial,sans-serif;max-width:560px;margin:0 auto;'>"
            + "<div style='background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:28px;text-align:center;border-radius:12px 12px 0 0;'>"
            + "<h1 style='color:white;margin:0;font-size:20px;'>Wizzybox VMS</h1>"
            + "<p style='color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:13px;'>Admin Login Alert</p>"
            + "</div>"
            + "<div style='background:white;padding:28px;border:1px solid #e5e7eb;border-top:none;'>"
            + "<h2 style='color:#1e1b4b;font-size:18px;margin:0 0 6px;'>Admin signed in</h2>"
            + "<p style='color:#64748b;font-size:13px;margin:0 0 20px;'>An administrator has logged into the Wizzybox VMS dashboard.</p>"
            + "<table style='width:100%;border-collapse:collapse;'>"
            + row("Full Name", name)
            + row("Username", username)
            + row("Email", email)
            + row("Login Time", time)
            + "</table>"
            + "<div style='margin-top:20px;background:#eff6ff;border-left:4px solid #4f46e5;padding:14px 18px;border-radius:6px;'>"
            + "<p style='margin:0;color:#1e40af;font-size:13px;font-weight:600;'>Security Notice</p>"
            + "<p style='margin:6px 0 0;color:#3730a3;font-size:12px;'>If this was not you, please change your password immediately.</p>"
            + "</div>"
            + "<div style='margin-top:20px;text-align:center;'>"
            + "<a href='http://localhost:5173/admin' style='display:inline-block;background:#4f46e5;color:white;text-decoration:none;padding:11px 24px;border-radius:8px;font-size:13px;font-weight:700;'>Open Admin Dashboard</a>"
            + "</div>"
            + "</div>"
            + "<div style='background:#f8f9fc;padding:14px;text-align:center;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;'>"
            + "<p style='margin:0;color:#94a3b8;font-size:11px;'>Wizzybox VMS - Powered by NammaQA Training Center</p>"
            + "</div>"
            + "</body></html>";
    }

    private String row(String label, String value) {
        return "<tr>"
            + "<td style='padding:9px 0;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:13px;width:40%;'><strong>" + label + "</strong></td>"
            + "<td style='padding:9px 0;border-bottom:1px solid #f1f5f9;color:#1e293b;font-size:13px;font-weight:600;'>" + value + "</td>"
            + "</tr>";
    }
}
