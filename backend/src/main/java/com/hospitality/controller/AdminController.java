package com.hospitality.controller;

import com.hospitality.dto.*;
import com.hospitality.entity.enums.BookingStatus;
import com.hospitality.exception.UnauthorizedException;
import com.hospitality.service.AdminService;
import com.hospitality.service.BookingService;
import com.hospitality.service.HotelService;
import com.hospitality.service.UserService;
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

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "Admin-only endpoints for managing hotels, rooms, and bookings")
@SecurityRequirement(name = "bearerAuth")
public class AdminController {

    private final HotelService hotelService;
    private final AdminService adminService;
    private final BookingService bookingService;
    private final UserService userService;

    private void verifyAdmin(Jwt jwt) {
        String clerkId = jwt.getSubject();
        if (!userService.isAdmin(clerkId)) {
            throw new UnauthorizedException("Admin access required");
        }
    }

    // ---- Hotels ----

    @PostMapping("/hotels")
    @Operation(summary = "Create a hotel")
    public ResponseEntity<ApiResponse<HotelResponse>> createHotel(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody CreateHotelRequest req) {
        verifyAdmin(jwt);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Hotel created", hotelService.createHotel(req)));
    }

    @PutMapping("/hotels/{id}")
    @Operation(summary = "Update a hotel")
    public ResponseEntity<ApiResponse<HotelResponse>> updateHotel(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long id,
            @Valid @RequestBody CreateHotelRequest req) {
        verifyAdmin(jwt);
        return ResponseEntity.ok(ApiResponse.success("Hotel updated", hotelService.updateHotel(id, req)));
    }

    @DeleteMapping("/hotels/{id}")
    @Operation(summary = "Delete a hotel")
    public ResponseEntity<ApiResponse<Void>> deleteHotel(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long id) {
        verifyAdmin(jwt);
        hotelService.deleteHotel(id);
        return ResponseEntity.ok(ApiResponse.success("Hotel deleted", null));
    }

    // ---- Rooms ----

    @PostMapping("/rooms")
    @Operation(summary = "Add a room to a hotel")
    public ResponseEntity<ApiResponse<RoomResponse>> addRoom(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody CreateRoomRequest req) {
        verifyAdmin(jwt);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Room added", adminService.addRoom(req)));
    }

    @PutMapping("/rooms/{id}")
    @Operation(summary = "Update a room")
    public ResponseEntity<ApiResponse<RoomResponse>> updateRoom(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long id,
            @Valid @RequestBody CreateRoomRequest req) {
        verifyAdmin(jwt);
        return ResponseEntity.ok(ApiResponse.success("Room updated", adminService.updateRoom(id, req)));
    }

    @DeleteMapping("/rooms/{id}")
    @Operation(summary = "Delete a room")
    public ResponseEntity<ApiResponse<Void>> deleteRoom(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long id) {
        verifyAdmin(jwt);
        adminService.deleteRoom(id);
        return ResponseEntity.ok(ApiResponse.success("Room deleted", null));
    }

    // ---- Bookings ----

    @GetMapping("/bookings")
    @Operation(summary = "Get all bookings (paginated)")
    public ResponseEntity<ApiResponse<PageResponse<BookingResponse>>> getAllBookings(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        verifyAdmin(jwt);
        return ResponseEntity.ok(ApiResponse.success(bookingService.getAllBookings(page, size)));
    }

    @PutMapping("/bookings/{id}/status")
    @Operation(summary = "Update booking status")
    public ResponseEntity<ApiResponse<BookingResponse>> updateBookingStatus(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long id,
            @RequestBody UpdateBookingStatusRequest req) {
        verifyAdmin(jwt);
        return ResponseEntity.ok(ApiResponse.success("Status updated",
                bookingService.updateBookingStatus(id, req.getStatus())));
    }

    // ---- Analytics ----

    @GetMapping("/analytics")
    @Operation(summary = "Get platform analytics")
    public ResponseEntity<ApiResponse<AnalyticsResponse>> getAnalytics(@AuthenticationPrincipal Jwt jwt) {
        verifyAdmin(jwt);
        return ResponseEntity.ok(ApiResponse.success(adminService.getAnalytics()));
    }
}
