package com.hospitality.service;

import com.hospitality.dto.*;
import com.hospitality.entity.Booking;
import com.hospitality.entity.Room;
import com.hospitality.entity.enums.BookingStatus;
import com.hospitality.exception.BookingConflictException;
import com.hospitality.exception.ResourceNotFoundException;
import com.hospitality.exception.UnauthorizedException;
import com.hospitality.repository.BookingRepository;
import com.hospitality.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;

    @Transactional
    public BookingResponse createBooking(String clerkUserId, CreateBookingRequest req) {
        // Validate dates
        if (!req.getCheckOutDate().isAfter(req.getCheckInDate())) {
            throw new IllegalArgumentException("Check-out date must be after check-in date");
        }
        if (req.getCheckInDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Check-in date cannot be in the past");
        }

        Room room = roomRepository.findById(req.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + req.getRoomId()));

        if (!room.getIsAvailable()) {
            throw new BookingConflictException("Room " + room.getRoomNumber() + " is not available");
        }

        // Check for conflicting bookings
        List<Booking> conflicts = bookingRepository.findConflictingBookings(
                req.getRoomId(), req.getCheckInDate(), req.getCheckOutDate());
        if (!conflicts.isEmpty()) {
            throw new BookingConflictException("Room is already booked for the selected dates");
        }

        // Calculate total price
        long nights = ChronoUnit.DAYS.between(req.getCheckInDate(), req.getCheckOutDate());
        BigDecimal totalAmount = room.getPricePerNight().multiply(BigDecimal.valueOf(nights));

        Booking booking = new Booking();
        booking.setClerkUserId(clerkUserId);
        booking.setRoom(room);
        booking.setCheckInDate(req.getCheckInDate());
        booking.setCheckOutDate(req.getCheckOutDate());
        booking.setGuestCount(req.getGuestCount());
        booking.setSpecialRequests(req.getSpecialRequests());
        booking.setTotalAmount(totalAmount);
        booking.setStatus(BookingStatus.PENDING);

        return mapToResponse(bookingRepository.save(booking));
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getBookingsByUser(String clerkUserId) {
        return bookingRepository.findByClerkUserIdOrderByCreatedAtDesc(clerkUserId)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BookingResponse getBookingById(Long id, String clerkUserId) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
        if (!booking.getClerkUserId().equals(clerkUserId)) {
            throw new UnauthorizedException("You do not have permission to view this booking");
        }
        return mapToResponse(booking);
    }

    @Transactional
    public BookingResponse cancelBooking(Long id, String clerkUserId) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
        if (!booking.getClerkUserId().equals(clerkUserId)) {
            throw new UnauthorizedException("You do not have permission to cancel this booking");
        }
        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new IllegalArgumentException("Booking is already cancelled");
        }
        if (booking.getStatus() == BookingStatus.COMPLETED) {
            throw new IllegalArgumentException("Cannot cancel a completed booking");
        }
        booking.setStatus(BookingStatus.CANCELLED);
        return mapToResponse(bookingRepository.save(booking));
    }

    @Transactional(readOnly = true)
    public PageResponse<BookingResponse> getAllBookings(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Booking> bookingPage = bookingRepository.findAllByOrderByCreatedAtDesc(pageable);
        List<BookingResponse> content = bookingPage.getContent().stream()
                .map(this::mapToResponse).collect(Collectors.toList());
        return PageResponse.<BookingResponse>builder()
                .content(content)
                .totalElements(bookingPage.getTotalElements())
                .totalPages(bookingPage.getTotalPages())
                .page(bookingPage.getNumber())
                .size(bookingPage.getSize())
                .last(bookingPage.isLast())
                .build();
    }

    @Transactional
    public BookingResponse updateBookingStatus(Long id, BookingStatus status) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
        booking.setStatus(status);
        return mapToResponse(bookingRepository.save(booking));
    }

    @Transactional
    public void confirmBooking(String paymentIntentId) {
        bookingRepository.findByPaymentIntentId(paymentIntentId).ifPresent(booking -> {
            booking.setStatus(BookingStatus.CONFIRMED);
            bookingRepository.save(booking);
            log.info("Booking {} confirmed via payment intent {}", booking.getId(), paymentIntentId);
        });
    }

    public BookingResponse mapToResponse(Booking booking) {
        Room room = booking.getRoom();
        return BookingResponse.builder()
                .id(booking.getId())
                .clerkUserId(booking.getClerkUserId())
                .roomId(room.getId())
                .roomNumber(room.getRoomNumber())
                .roomType(room.getType().name())
                .hotelId(room.getHotel().getId())
                .hotelName(room.getHotel().getName())
                .hotelCity(room.getHotel().getCity())
                .checkInDate(booking.getCheckInDate())
                .checkOutDate(booking.getCheckOutDate())
                .status(booking.getStatus())
                .totalAmount(booking.getTotalAmount())
                .guestCount(booking.getGuestCount())
                .specialRequests(booking.getSpecialRequests())
                .paymentIntentId(booking.getPaymentIntentId())
                .createdAt(booking.getCreatedAt())
                .build();
    }
}
