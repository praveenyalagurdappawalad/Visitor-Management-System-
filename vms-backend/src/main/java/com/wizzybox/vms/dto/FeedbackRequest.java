package com.wizzybox.vms.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class FeedbackRequest {

    @NotBlank(message = "Visitor name is required")
    private String visitorName;

    @NotBlank(message = "Department is required")
    private String department;

    @Min(1) @Max(5)
    private int rating;

    private String comment;
}
