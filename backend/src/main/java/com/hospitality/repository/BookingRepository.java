package com.hospitality.repository;

import com.hospitality.entity.Booking;
import com.hospitality.entity.enums.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByClerkUserIdOrderByCreatedAtDesc(String clerkUserId);

    @Query("SELECT b FROM Booking b WHERE b.room.id = :roomId AND b.status IN ('PENDING', 'CONFIRMED') AND (b.checkInDate < :checkOut AND b.checkOutDate > :checkIn)")
    List<Booking> findConflictingBookings(@Param("roomId") Long roomId, @Param("checkIn") LocalDate checkIn, @Param("checkOut") LocalDate checkOut);

    Page<Booking> findAllByOrderByCreatedAtDesc(Pageable pageable);

    long countByStatus(BookingStatus status);

    @Query("SELECT COALESCE(SUM(b.totalAmount), 0) FROM Booking b WHERE b.status = :status")
    BigDecimal sumTotalAmountByStatus(@Param("status") BookingStatus status);

    Optional<Booking> findByPaymentIntentId(String paymentIntentId);
}
