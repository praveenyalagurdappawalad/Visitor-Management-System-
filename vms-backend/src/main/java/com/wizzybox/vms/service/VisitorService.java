package com.wizzybox.vms.service;

import com.wizzybox.vms.dto.VisitorRequest;
import com.wizzybox.vms.entity.Visitor;
import com.wizzybox.vms.entity.VisitorStatus;
import com.wizzybox.vms.repository.VisitorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VisitorService {

    private final VisitorRepository visitorRepository;
    private final EmailService emailService;

    @Value("${app.upload.dir}")
    private String uploadDir;

    public Visitor checkIn(VisitorRequest req, MultipartFile photo) throws IOException {
        String photoPath = null;
        if (photo != null && !photo.isEmpty()) {
            photoPath = savePhoto(photo);
        }

        Visitor visitor = Visitor.builder()
                .name(req.getName())
                .mobile(req.getMobile())
                .department(req.getDepartment())
                .purpose(req.getPurpose())
                .host(req.getHost())
                .photoPath(photoPath)
                .status(VisitorStatus.WAITING)
                .build();

        visitor = visitorRepository.save(visitor);

        // Send check-in notification email to company
        emailService.sendCheckInNotification(visitor);

        return visitor;
    }

    public List<Visitor> getAllVisitors() {
        return visitorRepository.findAll();
    }

    public List<Visitor> getByStatus(VisitorStatus status) {
        return visitorRepository.findByStatus(status);
    }

    public Visitor updateStatus(Long id, VisitorStatus status) {
        Visitor visitor = visitorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Visitor not found: " + id));
        visitor.setStatus(status);
        if (status == VisitorStatus.EXITED) {
            visitor.setCheckOutTime(LocalDateTime.now());
        }
        return visitorRepository.save(visitor);
    }

    public void deleteVisitor(Long id) {
        visitorRepository.deleteById(id);
    }

    public List<Visitor> getVisitorsByDate(LocalDate date) {
        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end   = date.plusDays(1).atStartOfDay();
        return visitorRepository.findByCheckInTimeBetween(start, end);
    }

    public Object getAnalytics() {
        long total    = visitorRepository.count();
        long waiting  = visitorRepository.countByStatus(VisitorStatus.WAITING);
        long approved = visitorRepository.countByStatus(VisitorStatus.APPROVED);
        long exited   = visitorRepository.countByStatus(VisitorStatus.EXITED);
        return new java.util.HashMap<String, Object>() {{
            put("total",    total);
            put("waiting",  waiting);
            put("approved", approved);
            put("exited",   exited);
            put("onPremises", total - exited);
        }};
    }

    private String savePhoto(MultipartFile file) throws IOException {
        Path dir = Paths.get(uploadDir);
        Files.createDirectories(dir);
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path target = dir.resolve(filename);
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
        return filename;
    }
}
