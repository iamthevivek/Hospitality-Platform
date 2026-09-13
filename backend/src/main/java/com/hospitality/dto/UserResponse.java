package com.hospitality.dto;

import com.hospitality.entity.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private String clerkId;
    private String email;
    private String firstName;
    private String lastName;
    private UserRole role;
    private LocalDateTime createdAt;
}
