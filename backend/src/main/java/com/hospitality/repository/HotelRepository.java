package com.hospitality.repository;

import com.hospitality.entity.Hotel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long> {

    Page<Hotel> findByCityContainingIgnoreCase(String city, Pageable pageable);

    Page<Hotel> findByCityContainingIgnoreCaseAndStarRatingGreaterThanEqual(String city, int starRating, Pageable pageable);

    @Query("SELECT h FROM Hotel h WHERE " +
           "LOWER(h.city) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(h.country) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(h.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Hotel> searchByKeyword(@Param("query") String query, Pageable pageable);

    @Query("SELECT h FROM Hotel h WHERE " +
           "(LOWER(h.city) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(h.country) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(h.name) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "h.starRating >= :starRating")
    Page<Hotel> searchByKeywordAndRating(@Param("query") String query, @Param("starRating") int starRating, Pageable pageable);

    @Query("SELECT DISTINCT h FROM Hotel h JOIN h.rooms r WHERE h.city LIKE %:city% AND r.isAvailable = true AND r.maxOccupancy >= :guestCount " +
           "AND r.id NOT IN (SELECT b.room.id FROM Booking b WHERE b.status IN ('PENDING', 'CONFIRMED') AND (b.checkInDate < :checkOut AND b.checkOutDate > :checkIn))")
    Page<Hotel> findAvailableHotels(@Param("city") String city, @Param("checkIn") LocalDate checkIn, @Param("checkOut") LocalDate checkOut, @Param("guestCount") int guestCount, Pageable pageable);
}
