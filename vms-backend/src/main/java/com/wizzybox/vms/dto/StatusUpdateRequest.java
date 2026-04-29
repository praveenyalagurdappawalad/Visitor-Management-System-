package com.wizzybox.vms.dto;

import com.wizzybox.vms.entity.VisitorStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StatusUpdateRequest {
    @NotNull(message = "Status is required")
    private VisitorStatus status;
}
