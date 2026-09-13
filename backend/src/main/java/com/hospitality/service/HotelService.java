package com.hospitality.service;

import com.hospitality.dto.*;
import com.hospitality.entity.Hotel;
import com.hospitality.entity.Room;
import com.hospitality.exception.ResourceNotFoundException;
import com.hospitality.repository.HotelRepository;
import com.hospitality.repository.ReviewRepository;
import com.hospitality.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class HotelService {

    private final HotelRepository hotelRepository;
    private final RoomRepository roomRepository;
    private final ReviewRepository reviewRepository;

    @Transactional(readOnly = true)
    public PageResponse<HotelResponse> getAllHotels(int page, int size, String city, Integer minRating) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        Page<Hotel> hotelPage;
        if (city != null && !city.isBlank() && minRating != null) {
            hotelPage = hotelRepository.searchByKeywordAndRating(city.trim(), minRating, pageable);
        } else if (city != null && !city.isBlank()) {
            hotelPage = hotelRepository.searchByKeyword(city.trim(), pageable);
        } else {
            hotelPage = hotelRepository.findAll(pageable);
        }
        return toPageResponse(hotelPage);
    }

    @Transactional(readOnly = true)
    public HotelResponse getHotelById(Long id) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + id));
        List<RoomResponse> rooms = roomRepository.findByHotelId(id)
                .stream().map(this::mapRoomToResponse).collect(Collectors.toList());
        HotelResponse response = mapToResponse(hotel);
        response.setRooms(rooms);
        return response;
    }

    @Transactional(readOnly = true)
    public PageResponse<HotelResponse> searchHotels(String city, LocalDate checkIn, LocalDate checkOut,
                                                     int guests, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Hotel> hotelPage;
        if (city != null && !city.isBlank()) {
            hotelPage = hotelRepository.searchByKeyword(city.trim(), pageable);
        } else {
            hotelPage = hotelRepository.findAll(pageable);
        }
        return toPageResponse(hotelPage);
    }

    @Transactional(readOnly = true)
    public List<RoomResponse> getAvailableRooms(Long hotelId, LocalDate checkIn, LocalDate checkOut, int guests) {
        hotelRepository.findById(hotelId)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + hotelId));
        return roomRepository.findAvailableRooms(hotelId, checkIn, checkOut, guests)
                .stream().map(this::mapRoomToResponse).collect(Collectors.toList());
    }

    @Transactional
    public HotelResponse createHotel(CreateHotelRequest req) {
        Hotel hotel = new Hotel();
        updateHotelFromRequest(hotel, req);
        return mapToResponse(hotelRepository.save(hotel));
    }

    @Transactional
    public HotelResponse updateHotel(Long id, CreateHotelRequest req) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + id));
        updateHotelFromRequest(hotel, req);
        return mapToResponse(hotelRepository.save(hotel));
    }

    @Transactional
    public void deleteHotel(Long id) {
        if (!hotelRepository.existsById(id)) {
            throw new ResourceNotFoundException("Hotel not found with id: " + id);
        }
        hotelRepository.deleteById(id);
    }

    private void updateHotelFromRequest(Hotel hotel, CreateHotelRequest req) {
        hotel.setName(req.getName());
        hotel.setDescription(req.getDescription());
        hotel.setCity(req.getCity());
        hotel.setCountry(req.getCountry());
        hotel.setAddress(req.getAddress());
        hotel.setStarRating(req.getStarRating());
        hotel.setPriceFrom(req.getPriceFrom());
        hotel.setLatitude(req.getLatitude());
        hotel.setLongitude(req.getLongitude());
        if (req.getImageUrls() != null) {
            hotel.setImageUrls(String.join(",", req.getImageUrls()));
        }
        if (req.getAmenities() != null) {
            hotel.setAmenities(String.join(",", req.getAmenities()));
        }
    }

    private PageResponse<HotelResponse> toPageResponse(Page<Hotel> page) {
        List<HotelResponse> content = page.getContent().stream()
                .map(this::mapToResponse).collect(Collectors.toList());
        return PageResponse.<HotelResponse>builder()
                .content(content)
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .page(page.getNumber())
                .size(page.getSize())
                .last(page.isLast())
                .build();
    }

    public HotelResponse mapToResponse(Hotel hotel) {
        Double avgRating = reviewRepository.getAverageRatingByHotelId(hotel.getId());
        int reviewCount = reviewRepository.countByHotelId(hotel.getId());
        int roomCount = roomRepository.countByHotelId(hotel.getId());

        String rawImages = hotel.getImageUrls();
        List<String> imageUrls = List.of();
        if (rawImages != null && !rawImages.isBlank()) {
            if (rawImages.contains(",")) {
                imageUrls = Arrays.stream(rawImages.split(","))
                        .map(String::trim).filter(s -> !s.isEmpty()).collect(Collectors.toList());
            } else {
                imageUrls = Arrays.stream(rawImages.split("\\s+"))
                        .map(String::trim).filter(s -> !s.isEmpty()).collect(Collectors.toList());
            }
        }

        String rawAmenities = hotel.getAmenities();
        List<String> amenities = List.of();
        if (rawAmenities != null && !rawAmenities.isBlank()) {
            if (rawAmenities.contains(",")) {
                amenities = Arrays.stream(rawAmenities.split(","))
                        .map(String::trim).filter(s -> !s.isEmpty()).collect(Collectors.toList());
            } else {
                amenities = Arrays.stream(rawAmenities.split("\\s+"))
                        .map(String::trim).filter(s -> !s.isEmpty()).collect(Collectors.toList());
            }
        }

        return HotelResponse.builder()
                .id(hotel.getId())
                .name(hotel.getName())
                .description(hotel.getDescription())
                .city(hotel.getCity())
                .country(hotel.getCountry())
                .address(hotel.getAddress())
                .starRating(hotel.getStarRating())
                .imageUrls(imageUrls)
                .priceFrom(hotel.getPriceFrom())
                .amenities(amenities)
                .latitude(hotel.getLatitude())
                .longitude(hotel.getLongitude())
                .averageRating(avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0)
                .reviewCount(reviewCount)
                .roomCount(roomCount)
                .build();
    }

    public RoomResponse mapRoomToResponse(Room room) {
        String rawAmenities = room.getAmenities();
        List<String> amenities = List.of();
        if (rawAmenities != null && !rawAmenities.isBlank()) {
            if (rawAmenities.contains(",")) {
                amenities = Arrays.stream(rawAmenities.split(","))
                        .map(String::trim).filter(s -> !s.isEmpty()).collect(Collectors.toList());
            } else {
                amenities = Arrays.stream(rawAmenities.split("\\s+"))
                        .map(String::trim).filter(s -> !s.isEmpty()).collect(Collectors.toList());
            }
        }

        String rawImages = room.getImageUrls();
        List<String> imageUrls = List.of();
        if (rawImages != null && !rawImages.isBlank()) {
            if (rawImages.contains(",")) {
                imageUrls = Arrays.stream(rawImages.split(","))
                        .map(String::trim).filter(s -> !s.isEmpty()).collect(Collectors.toList());
            } else {
                imageUrls = Arrays.stream(rawImages.split("\\s+"))
                        .map(String::trim).filter(s -> !s.isEmpty()).collect(Collectors.toList());
            }
        }

        return RoomResponse.builder()
                .id(room.getId())
                .hotelId(room.getHotel().getId())
                .hotelName(room.getHotel().getName())
                .hotelCity(room.getHotel().getCity())
                .roomNumber(room.getRoomNumber())
                .type(room.getType())
                .pricePerNight(room.getPricePerNight())
                .maxOccupancy(room.getMaxOccupancy())
                .description(room.getDescription())
                .isAvailable(room.getIsAvailable())
                .amenities(amenities)
                .imageUrls(imageUrls)
                .build();
    }
}
