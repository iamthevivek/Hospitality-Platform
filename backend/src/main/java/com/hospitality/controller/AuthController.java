package com.hospitality.controller;

import com.hospitality.dto.*;
import com.hospitality.entity.User;
import com.hospitality.entity.enums.UserRole;
import com.hospitality.repository.UserRepository;
import com.hospitality.service.JwtService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Authentication", description = "Native email and password authentication")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @PostMapping("/register")
    @Operation(summary = "Register a new user with email and password")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest req) {
        String email = req.getEmail().toLowerCase().trim();

        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("An account with this email already exists"));
        }

        // Determine role (default to ADMIN for admin@stayease.in, else GUEST)
        UserRole role = email.equalsIgnoreCase("admin@stayease.in") ? UserRole.ADMIN : UserRole.GUEST;
        String userId = "usr_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16);

        User user = User.builder()
                .clerkId(userId)
                .email(email)
                .firstName(req.getFirstName().trim())
                .lastName(req.getLastName() != null ? req.getLastName().trim() : "")
                .password(passwordEncoder.encode(req.getPassword()))
                .role(role)
                .build();

        userRepository.save(user);
        log.info("New user registered natively: {} ({}) with role {}", email, userId, role);

        String token = jwtService.generateToken(user);
        UserResponse userResponse = toUserResponse(user);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Registration successful", new AuthResponse(token, userResponse)));
    }

    @PostMapping("/login")
    @Operation(summary = "Login with email and password")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest req) {
        String email = req.getEmail().toLowerCase().trim();

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Invalid email or password"));
        }

        User user = userOpt.get();

        // Check password
        if (user.getPassword() == null || !passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Invalid email or password"));
        }

        String token = jwtService.generateToken(user);
        UserResponse userResponse = toUserResponse(user);
        log.info("User logged in natively: {} ({})", email, user.getClerkId());

        return ResponseEntity.ok(ApiResponse.success("Login successful", new AuthResponse(token, userResponse)));
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user profile")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(@AuthenticationPrincipal Jwt jwt) {
        if (jwt == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Not authenticated"));
        }

        String userId = jwt.getSubject();
        Optional<User> userOpt = userRepository.findById(userId);

        if (userOpt.isPresent()) {
            return ResponseEntity.ok(ApiResponse.success(toUserResponse(userOpt.get())));
        }

        // If user not in DB yet (e.g. from token claims), build from claims
        String email = jwt.getClaimAsString("email");
        String firstName = jwt.getClaimAsString("given_name");
        String lastName = jwt.getClaimAsString("family_name");
        String roleStr = jwt.getClaimAsString("role");
        UserRole role = "ADMIN".equalsIgnoreCase(roleStr) ? UserRole.ADMIN : UserRole.GUEST;

        UserResponse fallback = UserResponse.builder()
                .clerkId(userId)
                .email(email != null ? email : "")
                .firstName(firstName != null ? firstName : "Guest")
                .lastName(lastName != null ? lastName : "")
                .role(role)
                .build();

        return ResponseEntity.ok(ApiResponse.success(fallback));
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout user")
    public ResponseEntity<ApiResponse<String>> logout() {
        return ResponseEntity.ok(ApiResponse.success("Logged out successfully", "Session terminated"));
    }

    private UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .clerkId(user.getClerkId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
