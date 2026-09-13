package com.hospitality.controller;

import com.hospitality.dto.ApiResponse;
import com.hospitality.dto.CreateReviewRequest;
import com.hospitality.dto.ReviewResponse;
import com.hospitality.service.ReviewService;
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
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@Tag(name = "Reviews", description = "Hotel review management")
@SecurityRequirement(name = "bearerAuth")
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    @Operation(summary = "Submit a hotel review")
    public ResponseEntity<ApiResponse<ReviewResponse>> createReview(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody CreateReviewRequest req) {
        String clerkUserId = jwt.getSubject();
        ReviewResponse review = reviewService.createReview(clerkUserId, req);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Review submitted", review));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a review")
    public ResponseEntity<ApiResponse<Void>> deleteReview(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long id) {
        String clerkUserId = jwt.getSubject();
        reviewService.deleteReview(id, clerkUserId);
        return ResponseEntity.ok(ApiResponse.success("Review deleted", null));
    }
}
