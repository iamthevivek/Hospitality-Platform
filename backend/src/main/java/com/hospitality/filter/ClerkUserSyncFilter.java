package com.hospitality.filter;

import com.hospitality.service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class ClerkUserSyncFilter extends OncePerRequestFilter {

    private final UserService userService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.getPrincipal() instanceof Jwt jwt) {
                String clerkId = jwt.getSubject();
                String email = jwt.getClaimAsString("email");
                String firstName = jwt.getClaimAsString("given_name");
                String lastName = jwt.getClaimAsString("family_name");
                if (clerkId != null && email != null) {
                    userService.syncUser(clerkId, email, firstName, lastName);
                }
            }
        } catch (Exception e) {
            log.warn("Failed to sync Clerk user: {}", e.getMessage());
        }
        filterChain.doFilter(request, response);
    }
}
