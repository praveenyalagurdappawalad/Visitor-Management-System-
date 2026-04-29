package com.wizzybox.vms.controller;

import com.wizzybox.vms.dto.StatusUpdateRequest;
import com.wizzybox.vms.dto.VisitorRequest;
import com.wizzybox.vms.entity.Visitor;
import com.wizzybox.vms.entity.VisitorStatus;
import com.wizzybox.vms.service.VisitorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/visitors")
@RequiredArgsConstructor
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class VisitorController {

    private final VisitorService visitorService;

    // POST /api/visitors/checkin  (multipart: visitorData + photo)
    @PostMapping(value = "/checkin", consumes = "multipart/form-data")
    public ResponseEntity<Visitor> checkIn(
            @RequestPart("visitor") @Valid VisitorRequest req,
            @RequestPart(value = "photo", required = false) MultipartFile photo
    ) throws IOException {
        return ResponseEntity.ok(visitorService.checkIn(req, photo));
    }

    // GET /api/visitors
    @GetMapping
    public ResponseEntity<List<Visitor>> getAll(
            @RequestParam(required = false) VisitorStatus status
    ) {
        if (status != null) return ResponseEntity.ok(visitorService.getByStatus(status));
        return ResponseEntity.ok(visitorService.getAllVisitors());
    }

    // PATCH /api/visitors/{id}/status
    @PatchMapping("/{id}/status")
    public ResponseEntity<Visitor> updateStatus(
            @PathVariable Long id,
            @RequestBody @Valid StatusUpdateRequest req
    ) {
        return ResponseEntity.ok(visitorService.updateStatus(id, req.getStatus()));
    }

    // DELETE /api/visitors/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        visitorService.deleteVisitor(id);
        return ResponseEntity.noContent().build();
    }

    // GET /api/visitors/by-date?date=2026-04-17
    @GetMapping("/by-date")
    public ResponseEntity<List<Visitor>> getByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        return ResponseEntity.ok(visitorService.getVisitorsByDate(date));
    }

    // GET /api/visitors/analytics
    @GetMapping("/analytics")
    public ResponseEntity<Object> getAnalytics() {
        return ResponseEntity.ok(visitorService.getAnalytics());
    }
}
