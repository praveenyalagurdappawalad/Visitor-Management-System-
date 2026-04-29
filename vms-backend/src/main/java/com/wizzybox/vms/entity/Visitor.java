package com.wizzybox.vms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "visitors")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Visitor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @NotBlank
    @Pattern(regexp = "\\d{10}")
    @Column(nullable = false, length = 10)
    private String mobile;

    @NotBlank
    private String department;

    @NotBlank
    private String purpose;

    @NotBlank
    private String host;

    private String photoPath;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VisitorStatus status = VisitorStatus.WAITING;

    @Column(nullable = false, updatable = false)
    private LocalDateTime checkInTime;

    private LocalDateTime checkOutTime;

    @PrePersist
    protected void onCreate() {
        checkInTime = LocalDateTime.now();
    }
}
