package com.hospitality.service;

import com.hospitality.dto.*;
import com.hospitality.entity.Room;
import com.hospitality.entity.enums.BookingStatus;
import com.hospitality.exception.ResourceNotFoundException;
import com.hospitality.repository.BookingRepository;
import com.hospitality.repository.HotelRepository;
import com.hospitality.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminService {

    private final HotelRepository hotelRepository;
    private final RoomRepository roomRepository;
    private final BookingRepository bookingRepository;
    private final HotelService hotelService;

    @Transactional(readOnly = true)
    public AnalyticsResponse getAnalytics() {
        long totalBookings = bookingRepository.count();
        long confirmedBookings = bookingRepository.countByStatus(BookingStatus.CONFIRMED);
        long cancelledBookings = bookingRepository.countByStatus(BookingStatus.CANCELLED);
        long pendingBookings = bookingRepository.countByStatus(BookingStatus.PENDING);
        long totalHotels = hotelRepository.count();
        long totalRooms = roomRepository.count();

        BigDecimal totalRevenue = bookingRepository.sumTotalAmountByStatus(BookingStatus.CONFIRMED);
        if (totalRevenue == null) totalRevenue = BigDecimal.ZERO;

        double occupancyRate = totalRooms > 0
                ? (double) confirmedBookings / totalRooms * 100.0
                : 0.0;

        return AnalyticsResponse.builder()
                .totalRevenue(totalRevenue)
                .totalBookings(totalBookings)
                .confirmedBookings(confirmedBookings)
                .cancelledBookings(cancelledBookings)
                .pendingBookings(pendingBookings)
                .totalHotels(totalHotels)
                .totalRooms(totalRooms)
                .occupancyRate(Math.round(occupancyRate * 10.0) / 10.0)
                .build();
    }

    @Transactional
    public RoomResponse addRoom(CreateRoomRequest req) {
        hotelRepository.findById(req.getHotelId())
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + req.getHotelId()));
        var hotel = hotelRepository.getReferenceById(req.getHotelId());

        Room room = new Room();
        room.setHotel(hotel);
        room.setRoomNumber(req.getRoomNumber());
        room.setType(req.getType());
        room.setPricePerNight(req.getPricePerNight());
        room.setMaxOccupancy(req.getMaxOccupancy());
        room.setDescription(req.getDescription());
        room.setIsAvailable(true);
        if (req.getAmenities() != null) room.setAmenities(String.join(",", req.getAmenities()));
        if (req.getImageUrls() != null) room.setImageUrls(String.join(",", req.getImageUrls()));

        return hotelService.mapRoomToResponse(roomRepository.save(room));
    }

    @Transactional
    public RoomResponse updateRoom(Long roomId, CreateRoomRequest req) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + roomId));
        room.setRoomNumber(req.getRoomNumber());
        room.setType(req.getType());
        room.setPricePerNight(req.getPricePerNight());
        room.setMaxOccupancy(req.getMaxOccupancy());
        room.setDescription(req.getDescription());
        if (req.getAmenities() != null) room.setAmenities(String.join(",", req.getAmenities()));
        if (req.getImageUrls() != null) room.setImageUrls(String.join(",", req.getImageUrls()));
        return hotelService.mapRoomToResponse(roomRepository.save(room));
    }

    @Transactional
    public void deleteRoom(Long roomId) {
        if (!roomRepository.existsById(roomId)) {
            throw new ResourceNotFoundException("Room not found with id: " + roomId);
        }
        roomRepository.deleteById(roomId);
    }
}
