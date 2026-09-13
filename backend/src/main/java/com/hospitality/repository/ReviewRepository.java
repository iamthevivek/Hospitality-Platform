package com.hospitality.repository;

import com.hospitality.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    
    List<Review> findByHotelIdOrderByCreatedAtDesc(Long hotelId);
    
    boolean existsByClerkUserIdAndHotelId(String clerkUserId, Long hotelId);
    
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.hotel.id = :hotelId")
    Double getAverageRatingByHotelId(@Param("hotelId") Long hotelId);

    int countByHotelId(Long hotelId);
}
