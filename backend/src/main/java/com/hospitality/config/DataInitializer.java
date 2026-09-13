package com.hospitality.config;

import com.hospitality.entity.User;
import com.hospitality.entity.enums.UserRole;
import com.hospitality.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        initDefaultUser("usr_admin_default", "admin@stayease.in", "Admin@123", "StayEase", "Admin", UserRole.ADMIN);
        initDefaultUser("usr_demo_traveler", "guest@stayease.in", "Guest@123", "Alex", "Morgan", UserRole.GUEST);
        // Also support old alex.morgan@example.com if user booked with it
        initDefaultUser("user_demo_traveler", "alex.morgan@example.com", "Guest@123", "Alex", "Morgan", UserRole.GUEST);
    }

    private void initDefaultUser(String id, String email, String rawPassword, String firstName, String lastName, UserRole role) {
        try {
            Optional<User> existing = userRepository.findByEmail(email.toLowerCase());
            if (existing.isEmpty()) {
                User user = User.builder()
                        .clerkId(id)
                        .email(email.toLowerCase())
                        .password(passwordEncoder.encode(rawPassword))
                        .firstName(firstName)
                        .lastName(lastName)
                        .role(role)
                        .build();
                userRepository.save(user);
                log.info("Initialized default account: {} ({}) with role {}", email, id, role);
            } else {
                User user = existing.get();
                if (user.getPassword() == null || user.getPassword().isBlank()) {
                    user.setPassword(passwordEncoder.encode(rawPassword));
                    userRepository.save(user);
                    log.info("Updated password for existing default account: {}", email);
                }
            }
        } catch (Exception e) {
            log.warn("Could not initialize default user {}: {}", email, e.getMessage());
        }
    }
}
