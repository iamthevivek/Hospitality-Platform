package com.hospitality.service;

import com.hospitality.dto.BookingResponse;
import com.hospitality.dto.PaymentIntentResponse;
import com.hospitality.entity.Booking;
import com.hospitality.entity.Payment;
import com.hospitality.entity.enums.BookingStatus;
import com.hospitality.entity.enums.PaymentStatus;
import com.hospitality.exception.ResourceNotFoundException;
import com.hospitality.exception.UnauthorizedException;
import com.hospitality.repository.BookingRepository;
import com.hospitality.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final BookingService bookingService;

    @Transactional
    public PaymentIntentResponse createPaymentIntent(Long bookingId, String clerkUserId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        if (!booking.getClerkUserId().equals(clerkUserId)) {
            throw new UnauthorizedException("You do not have permission to pay for this booking");
        }

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalArgumentException("Only PENDING bookings can be paid for");
        }

        String intentId = "pay_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16);
        booking.setPaymentIntentId(intentId);
        bookingRepository.save(booking);

        Payment payment = paymentRepository.findByBookingId(bookingId).orElseGet(Payment::new);
        payment.setBooking(booking);
        payment.setPaymentIntentId(intentId);
        payment.setAmount(booking.getTotalAmount());
        payment.setCurrency("inr");
        payment.setStatus(PaymentStatus.PENDING);
        paymentRepository.save(payment);

        return PaymentIntentResponse.builder()
                .clientSecret(intentId + "_secret")
                .bookingId(bookingId)
                .amount(booking.getTotalAmount())
                .currency("inr")
                .paymentIntentId(intentId)
                .build();
    }

    @Transactional
    public BookingResponse confirmDemoPayment(Long bookingId, String clerkUserId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        if (!booking.getClerkUserId().equals(clerkUserId)) {
            throw new UnauthorizedException("You do not have permission to confirm this booking");
        }

        booking.setStatus(BookingStatus.CONFIRMED);
        if (booking.getPaymentIntentId() == null) {
            booking.setPaymentIntentId("pay_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16));
        }
        bookingRepository.save(booking);

        Payment payment = paymentRepository.findByBookingId(bookingId).orElseGet(() -> {
            Payment p = new Payment();
            p.setBooking(booking);
            p.setPaymentIntentId(booking.getPaymentIntentId());
            p.setAmount(booking.getTotalAmount());
            p.setCurrency("inr");
            return p;
        });
        payment.setStatus(PaymentStatus.SUCCEEDED);
        paymentRepository.save(payment);

        return bookingService.mapToResponse(booking);
    }
}
