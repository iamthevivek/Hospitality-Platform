package com.hospitality.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsResponse {
    private BigDecimal totalRevenue;
    private Long totalBookings;
    private Long confirmedBookings;
    private Long cancelledBookings;
    private Long pendingBookings;
    private Long totalHotels;
    private Long totalRooms;
    private Double occupancyRate;
}
