package com.hospitality.controller;

import com.hospitality.dto.*;
import com.hospitality.service.HotelService;
import com.hospitality.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
@Tag(name = "Public Hotels", description = "Public hotel browsing endpoints — no authentication required")
public class PublicHotelController {

    private final HotelService hotelService;
    private final ReviewService reviewService;

    @GetMapping("/hotels")
    @Operation(summary = "List all hotels", description = "Returns paginated list of hotels with optional city and rating filters")
    public ResponseEntity<ApiResponse<PageResponse<HotelResponse>>> getAllHotels(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Integer minRating) {
        return ResponseEntity.ok(ApiResponse.success(hotelService.getAllHotels(page, size, city, minRating)));
    }

    @GetMapping("/hotels/{id}")
    @Operation(summary = "Get hotel by ID", description = "Returns hotel details including all rooms")
    public ResponseEntity<ApiResponse<HotelResponse>> getHotelById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(hotelService.getHotelById(id)));
    }

    @GetMapping("/hotels/search")
    @Operation(summary = "Search hotels", description = "Search hotels by city, dates, and guest count")
    public ResponseEntity<ApiResponse<PageResponse<HotelResponse>>> searchHotels(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut,
            @RequestParam(defaultValue = "1") int guests,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        return ResponseEntity.ok(ApiResponse.success(
                hotelService.searchHotels(city, checkIn, checkOut, guests, page, size)));
    }

    @GetMapping("/hotels/{id}/rooms/available")
    @Operation(summary = "Get available rooms", description = "Returns rooms available for the given dates and guest count")
    public ResponseEntity<ApiResponse<List<RoomResponse>>> getAvailableRooms(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut,
            @RequestParam(defaultValue = "1") int guests) {
        return ResponseEntity.ok(ApiResponse.success(hotelService.getAvailableRooms(id, checkIn, checkOut, guests)));
    }

    @GetMapping("/hotels/{id}/reviews")
    @Operation(summary = "Get hotel reviews")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getHotelReviews(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(reviewService.getHotelReviews(id)));
    }
}
