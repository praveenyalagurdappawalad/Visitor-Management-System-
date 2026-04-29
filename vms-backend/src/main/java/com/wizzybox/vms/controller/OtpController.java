package com.wizzybox.vms.controller;

import com.wizzybox.vms.service.OtpService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/otp")
@RequiredArgsConstructor
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class OtpController {

    private final OtpService otpService;

    // POST /api/otp/send  { "email": "..." }
    @PostMapping("/send")
    public ResponseEntity<Map<String, String>> sendOtp(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
        }
        otpService.generateAndSend(email);
        return ResponseEntity.ok(Map.of("message", "OTP sent to " + email));
    }

    // POST /api/otp/verify  { "email": "...", "otp": "..." }
    @PostMapping("/verify")
    public ResponseEntity<Map<String, String>> verifyOtp(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String otp   = body.get("otp");
        boolean valid = otpService.verify(email, otp);
        if (valid) {
            return ResponseEntity.ok(Map.of("message", "OTP verified"));
        }
        return ResponseEntity.badRequest().body(Map.of("error", "Invalid or expired OTP"));
    }
}
