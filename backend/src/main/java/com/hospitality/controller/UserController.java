package com.hospitality.controller;

import com.hospitality.dto.ApiResponse;
import com.hospitality.dto.UpdateUserRequest;
import com.hospitality.dto.UserResponse;
import com.hospitality.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "User profile management")
@SecurityRequirement(name = "bearerAuth")
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    @Operation(summary = "Get current user profile")
    public ResponseEntity<ApiResponse<UserResponse>> getProfile(@AuthenticationPrincipal Jwt jwt) {
        String clerkId = jwt.getSubject();
        return ResponseEntity.ok(ApiResponse.success(userService.getUserByClerkId(clerkId)));
    }

    @PutMapping("/me")
    @Operation(summary = "Update current user profile")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody UpdateUserRequest req) {
        String clerkId = jwt.getSubject();
        return ResponseEntity.ok(ApiResponse.success("Profile updated", userService.updateUser(clerkId, req)));
    }
}
