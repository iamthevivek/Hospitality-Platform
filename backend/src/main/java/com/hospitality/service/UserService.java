package com.hospitality.service;

import com.hospitality.dto.UpdateUserRequest;
import com.hospitality.dto.UserResponse;
import com.hospitality.entity.User;
import com.hospitality.entity.enums.UserRole;
import com.hospitality.exception.ResourceNotFoundException;
import com.hospitality.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional
    public User syncUser(String clerkId, String email, String firstName, String lastName) {
        return userRepository.findById(clerkId).orElseGet(() -> {
            log.info("Creating new user for Clerk ID: {}", clerkId);
            User newUser = new User();
            newUser.setClerkId(clerkId);
            newUser.setEmail(email);
            newUser.setFirstName(firstName);
            newUser.setLastName(lastName);
            newUser.setRole("user_demo_traveler".equals(clerkId) ? UserRole.ADMIN : UserRole.GUEST);
            return userRepository.save(newUser);
        });
    }

    @Transactional(readOnly = true)
    public UserResponse getUserByClerkId(String clerkId) {
        User user = userRepository.findById(clerkId)
                .orElseGet(() -> syncUser(clerkId, clerkId + "@example.com", "Demo", "User"));
        return mapToResponse(user);
    }

    @Transactional
    public UserResponse updateUser(String clerkId, UpdateUserRequest req) {
        User user = userRepository.findById(clerkId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (req.getFirstName() != null) user.setFirstName(req.getFirstName());
        if (req.getLastName() != null) user.setLastName(req.getLastName());
        return mapToResponse(userRepository.save(user));
    }

    @Transactional(readOnly = true)
    public boolean isAdmin(String clerkId) {
        if ("user_demo_traveler".equals(clerkId)) return true;
        return userRepository.findById(clerkId)
                .map(u -> u.getRole() == UserRole.ADMIN)
                .orElse(false);
    }

    private UserResponse mapToResponse(User user) {
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
