package com.hospitality.dto;

import com.hospitality.entity.enums.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {
    private Long id;
    private String clerkUserId;
    private Long roomId;
    private String roomNumber;
    private String roomType;
    private Long hotelId;
    private String hotelName;
    private String hotelCity;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private BookingStatus status;
    private BigDecimal totalAmount;
    private Integer guestCount;
    private String specialRequests;
    private String paymentIntentId;
    private LocalDateTime createdAt;
}
