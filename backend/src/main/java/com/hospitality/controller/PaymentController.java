package com.hospitality.controller;

import com.hospitality.dto.ApiResponse;
import com.hospitality.dto.BookingResponse;
import com.hospitality.dto.CreatePaymentIntentRequest;
import com.hospitality.dto.PaymentIntentResponse;
import com.hospitality.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Tag(name = "Payments", description = "Payment processing")
@SecurityRequirement(name = "bearerAuth")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-intent")
    @Operation(summary = "Create Payment Intent")
    public ResponseEntity<ApiResponse<PaymentIntentResponse>> createPaymentIntent(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody CreatePaymentIntentRequest req) {
        String clerkUserId = jwt.getSubject();
        PaymentIntentResponse response = paymentService.createPaymentIntent(req.getBookingId(), clerkUserId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/confirm-demo/{bookingId}")
    @Operation(summary = "Confirm payment")
    public ResponseEntity<ApiResponse<BookingResponse>> confirmDemoPayment(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long bookingId) {
        String clerkUserId = jwt.getSubject();
        BookingResponse response = paymentService.confirmDemoPayment(bookingId, clerkUserId);
        return ResponseEntity.ok(ApiResponse.success("Payment confirmed", response));
    }
}
