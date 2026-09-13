package com.hospitality.repository;

import com.hospitality.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

    List<Room> findByHotelIdAndIsAvailableTrue(Long hotelId);
    
    List<Room> findByHotelId(Long hotelId);

    @Query("SELECT r FROM Room r WHERE r.hotel.id = :hotelId AND r.isAvailable = true AND r.maxOccupancy >= :guestCount " +
           "AND r.id NOT IN (SELECT b.room.id FROM Booking b WHERE b.status IN ('PENDING', 'CONFIRMED') AND (b.checkInDate < :checkOut AND b.checkOutDate > :checkIn))")
    List<Room> findAvailableRooms(@Param("hotelId") Long hotelId, @Param("checkIn") LocalDate checkIn, @Param("checkOut") LocalDate checkOut, @Param("guestCount") int guestCount);

    int countByHotelId(Long hotelId);
}
