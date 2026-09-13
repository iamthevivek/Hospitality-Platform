package com.hospitality.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HotelResponse {
    private Long id;
    private String name;
    private String description;
    private String city;
    private String country;
    private String address;
    private Integer starRating;
    private List<String> imageUrls;
    private BigDecimal priceFrom;
    private List<String> amenities;
    private Double latitude;
    private Double longitude;
    private Double averageRating;
    private Integer reviewCount;
    private Integer roomCount;
    private List<RoomResponse> rooms;
}
