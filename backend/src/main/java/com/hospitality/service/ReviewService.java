package com.hospitality.service;

import com.hospitality.dto.CreateReviewRequest;
import com.hospitality.dto.ReviewResponse;
import com.hospitality.entity.Hotel;
import com.hospitality.entity.Review;
import com.hospitality.exception.ResourceNotFoundException;
import com.hospitality.exception.UnauthorizedException;
import com.hospitality.repository.HotelRepository;
import com.hospitality.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final HotelRepository hotelRepository;

    @Transactional(readOnly = true)
    public List<ReviewResponse> getHotelReviews(Long hotelId) {
        hotelRepository.findById(hotelId)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + hotelId));
        return reviewRepository.findByHotelIdOrderByCreatedAtDesc(hotelId)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional
    public ReviewResponse createReview(String clerkUserId, CreateReviewRequest req) {
        Hotel hotel = hotelRepository.findById(req.getHotelId())
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + req.getHotelId()));

        Review review = new Review();
        review.setClerkUserId(clerkUserId);
        review.setHotel(hotel);
        review.setRating(req.getRating());
        review.setComment(req.getComment());
        review.setReviewerName(req.getReviewerName() != null ? req.getReviewerName() : "Anonymous");

        return mapToResponse(reviewRepository.save(review));
    }

    @Transactional
    public void deleteReview(Long reviewId, String clerkUserId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + reviewId));
        if (!review.getClerkUserId().equals(clerkUserId)) {
            throw new UnauthorizedException("You do not have permission to delete this review");
        }
        reviewRepository.delete(review);
    }

    private ReviewResponse mapToResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .clerkUserId(review.getClerkUserId())
                .hotelId(review.getHotel().getId())
                .hotelName(review.getHotel().getName())
                .rating(review.getRating())
                .comment(review.getComment())
                .reviewerName(review.getReviewerName())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
