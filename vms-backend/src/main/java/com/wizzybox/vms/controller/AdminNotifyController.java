package com.wizzybox.vms.controller;

import com.wizzybox.vms.service.AdminNotifyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin-notify")
@RequiredArgsConstructor
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class AdminNotifyController {

    private final AdminNotifyService adminNotifyService;

    // POST /api/admin-notify/register
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> onRegister(@RequestBody Map<String, String> body) {
        adminNotifyService.sendRegistrationEmail(
            body.getOrDefault("name", "Unknown"),
            body.getOrDefault("username", "—"),
            body.getOrDefault("email", "—")
        );
        return ResponseEntity.ok(Map.of("message", "Registration notification sent"));
    }

    // POST /api/admin-notify/login
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> onLogin(@RequestBody Map<String, String> body) {
        adminNotifyService.sendLoginEmail(
            body.getOrDefault("name", "Unknown"),
            body.getOrDefault("username", "—"),
            body.getOrDefault("email", "—")
        );
        return ResponseEntity.ok(Map.of("message", "Login notification sent"));
    }
}
