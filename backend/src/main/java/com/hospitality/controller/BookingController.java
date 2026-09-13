package com.hospitality.controller;

import com.hospitality.dto.*;
import com.hospitality.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Tag(name = "Bookings", description = "Hotel room booking management")
@SecurityRequirement(name = "bearerAuth")
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    @Operation(summary = "Create a new booking")
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody CreateBookingRequest req) {
        String clerkUserId = jwt.getSubject();
        BookingResponse booking = bookingService.createBooking(clerkUserId, req);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Booking created", booking));
    }

    @GetMapping("/my")
    @Operation(summary = "Get my bookings")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getMyBookings(@AuthenticationPrincipal Jwt jwt) {
        String clerkUserId = jwt.getSubject();
        return ResponseEntity.ok(ApiResponse.success(bookingService.getBookingsByUser(clerkUserId)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get booking by ID")
    public ResponseEntity<ApiResponse<BookingResponse>> getBookingById(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long id) {
        String clerkUserId = jwt.getSubject();
        return ResponseEntity.ok(ApiResponse.success(bookingService.getBookingById(id, clerkUserId)));
    }

    @PutMapping("/{id}/cancel")
    @Operation(summary = "Cancel a booking")
    public ResponseEntity<ApiResponse<BookingResponse>> cancelBooking(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long id) {
        String clerkUserId = jwt.getSubject();
        return ResponseEntity.ok(ApiResponse.success("Booking cancelled", bookingService.cancelBooking(id, clerkUserId)));
    }
}
