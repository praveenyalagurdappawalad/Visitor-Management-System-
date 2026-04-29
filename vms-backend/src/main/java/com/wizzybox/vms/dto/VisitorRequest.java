package com.wizzybox.vms.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class VisitorRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Mobile is required")
    @Pattern(regexp = "\\d{10}", message = "Mobile must be 10 digits")
    private String mobile;

    @NotBlank(message = "Department is required")
    private String department;

    @NotBlank(message = "Purpose is required")
    private String purpose;

    @NotBlank(message = "Host is required")
    private String host;
}
