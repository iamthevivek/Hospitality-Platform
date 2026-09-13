package com.hospitality.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {
    private Long id;
    private String clerkUserId;
    private Long hotelId;
    private String hotelName;
    private Integer rating;
    private String comment;
    private String reviewerName;
    private LocalDateTime createdAt;
}
