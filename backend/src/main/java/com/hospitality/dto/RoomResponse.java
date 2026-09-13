package com.hospitality.dto;

import com.hospitality.entity.enums.RoomType;
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
public class RoomResponse {
    private Long id;
    private Long hotelId;
    private String hotelName;
    private String hotelCity;
    private String roomNumber;
    private RoomType type;
    private BigDecimal pricePerNight;
    private Integer maxOccupancy;
    private String description;
    private Boolean isAvailable;
    private List<String> amenities;
    private List<String> imageUrls;
}
