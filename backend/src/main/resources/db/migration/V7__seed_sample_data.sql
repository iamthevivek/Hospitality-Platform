INSERT INTO hotels (name, description, city, country, address, star_rating, image_urls, price_from, amenities, latitude, longitude) VALUES
('The Manhattan Grand', 'Iconic luxury hotel in the heart of Midtown Manhattan with breathtaking skyline views and world-class amenities.', 'New York', 'United States', '350 5th Avenue, New York, NY 10118', 5,
 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800,https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
 299.00, 'WiFi,Pool,Spa,Gym,Restaurant,Bar,Concierge,Valet Parking', 40.7484, -73.9967);

INSERT INTO rooms (hotel_id, room_number, type, price_per_night, max_occupancy, description, is_available, amenities, image_urls) VALUES
((SELECT id FROM hotels WHERE name='The Manhattan Grand'), '101', 'SINGLE', 299.00, 1, 'Cozy single room with city view, king-size bed, and premium amenities.', TRUE, 'WiFi,TV,Mini Bar,Safe', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'),
((SELECT id FROM hotels WHERE name='The Manhattan Grand'), '201', 'DOUBLE', 449.00, 2, 'Spacious double room with panoramic skyline views and sitting area.', TRUE, 'WiFi,TV,Mini Bar,Safe,Bathtub', 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'),
((SELECT id FROM hotels WHERE name='The Manhattan Grand'), '501', 'SUITE', 899.00, 4, 'Lavish suite with separate living room, dining area and butler service.', TRUE, 'WiFi,TV,Mini Bar,Safe,Jacuzzi,Butler Service,Dining Room', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800');

INSERT INTO hotels (name, description, city, country, address, star_rating, image_urls, price_from, amenities, latitude, longitude) VALUES
('Hotel Le Marais', 'Charming boutique hotel in the historic Le Marais district, steps from the Louvre and Notre Dame.', 'Paris', 'France', '12 Rue des Archives, 75004 Paris', 4,
 'https://images.unsplash.com/photo-1455587734955-081b22074882?w=800,https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800',
 180.00, 'WiFi,Restaurant,Bar,Concierge,Laundry', 48.8566, 2.3522);

INSERT INTO rooms (hotel_id, room_number, type, price_per_night, max_occupancy, description, is_available, amenities, image_urls) VALUES
((SELECT id FROM hotels WHERE name='Hotel Le Marais'), '105', 'SINGLE', 180.00, 1, 'Cozy Parisian room with classic French décor and courtyard views.', TRUE, 'WiFi,TV,Safe', 'https://images.unsplash.com/photo-1541971875076-8f970d573be6?w=800'),
((SELECT id FROM hotels WHERE name='Hotel Le Marais'), '205', 'DOUBLE', 280.00, 2, 'Elegant double room with Eiffel Tower views and French oak furniture.', TRUE, 'WiFi,TV,Safe,Bathtub,City View', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'),
((SELECT id FROM hotels WHERE name='Hotel Le Marais'), '305', 'SUITE', 550.00, 3, 'Romantic suite with private terrace overlooking the Parisian rooftops.', TRUE, 'WiFi,TV,Safe,Jacuzzi,Terrace,Champagne Welcome', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800');

INSERT INTO hotels (name, description, city, country, address, star_rating, image_urls, price_from, amenities, latitude, longitude) VALUES
('The Royal Kensington', 'Distinguished hotel near Hyde Park and Kensington Palace, offering timeless British elegance.', 'London', 'United Kingdom', '12 Kensington High Street, London W8 4PT', 5,
 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800,https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
 320.00, 'WiFi,Pool,Spa,Gym,Restaurant,Afternoon Tea,Concierge', 51.5074, -0.1278);

INSERT INTO rooms (hotel_id, room_number, type, price_per_night, max_occupancy, description, is_available, amenities, image_urls) VALUES
((SELECT id FROM hotels WHERE name='The Royal Kensington'), '110', 'SINGLE', 320.00, 1, 'Classic British single room with garden views and marble bathroom.', TRUE, 'WiFi,TV,Safe,Mini Bar', 'https://images.unsplash.com/photo-1631049552057-403cdb8f0658?w=800'),
((SELECT id FROM hotels WHERE name='The Royal Kensington'), '210', 'DOUBLE', 480.00, 2, 'Elegant double room with Hyde Park views and roll-top bath.', TRUE, 'WiFi,TV,Safe,Mini Bar,Roll-top Bath', 'https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800'),
((SELECT id FROM hotels WHERE name='The Royal Kensington'), '310', 'DELUXE', 720.00, 2, 'Deluxe room with private butler, premium bedding, and luxury toiletries.', TRUE, 'WiFi,TV,Safe,Mini Bar,Butler Service,Premium Toiletries', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800');

INSERT INTO hotels (name, description, city, country, address, star_rating, image_urls, price_from, amenities, latitude, longitude) VALUES
('Shinjuku Sky Hotel', 'Ultra-modern hotel with panoramic views of Mount Fuji and the Tokyo skyline, featuring cutting-edge design.', 'Tokyo', 'Japan', '2-1 Nishi-Shinjuku, Shinjuku-ku, Tokyo 163-8001', 5,
 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800,https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800',
 250.00, 'WiFi,Onsen,Gym,Sushi Restaurant,Bar,Concierge', 35.6762, 139.6503);

INSERT INTO rooms (hotel_id, room_number, type, price_per_night, max_occupancy, description, is_available, amenities, image_urls) VALUES
((SELECT id FROM hotels WHERE name='Shinjuku Sky Hotel'), 'S101', 'SINGLE', 250.00, 1, 'Japanese-inspired single room with tatami floor area and Fuji views.', TRUE, 'WiFi,TV,Safe,Yukata', 'https://images.unsplash.com/photo-1574643156929-51fa098b0394?w=800'),
((SELECT id FROM hotels WHERE name='Shinjuku Sky Hotel'), 'S201', 'DOUBLE', 380.00, 2, 'Modern double room featuring both Western and Japanese design elements.', TRUE, 'WiFi,TV,Safe,Onsen Access,Yukata', 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800'),
((SELECT id FROM hotels WHERE name='Shinjuku Sky Hotel'), 'S501', 'SUITE', 750.00, 3, 'Sky suite with floor-to-ceiling windows, private onsen, and Tokyo panorama.', TRUE, 'WiFi,TV,Safe,Private Onsen,Yukata,Sake Welcome', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800');

INSERT INTO hotels (name, description, city, country, address, star_rating, image_urls, price_from, amenities, latitude, longitude) VALUES
('Burj Al Zaman', 'Ultra-luxury 5-star resort with private beach, infinity pool, and stunning views of the Burj Khalifa.', 'Dubai', 'United Arab Emirates', 'Downtown Dubai, Sheikh Zayed Road, Dubai', 5,
 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800,https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
 450.00, 'WiFi,Private Beach,Infinity Pool,Spa,Multiple Restaurants,Desert Safari', 25.2048, 55.2708);

INSERT INTO rooms (hotel_id, room_number, type, price_per_night, max_occupancy, description, is_available, amenities, image_urls) VALUES
((SELECT id FROM hotels WHERE name='Burj Al Zaman'), 'D101', 'DOUBLE', 450.00, 2, 'Stunning room with Burj Khalifa and fountain views plus private balcony.', TRUE, 'WiFi,TV,Safe,Mini Bar,Private Balcony,Burj View', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'),
((SELECT id FROM hotels WHERE name='Burj Al Zaman'), 'D201', 'DELUXE', 680.00, 2, 'Deluxe room with private pool access and butler service.', TRUE, 'WiFi,TV,Safe,Mini Bar,Pool Access,Butler Service', 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800'),
((SELECT id FROM hotels WHERE name='Burj Al Zaman'), 'D501', 'SUITE', 1500.00, 4, 'Presidential suite with private infinity pool, helipad transfers, and 24hr butler.', TRUE, 'WiFi,TV,Safe,Private Pool,24hr Butler,Helipad Transfer,All Inclusive', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800');

INSERT INTO hotels (name, description, city, country, address, star_rating, image_urls, price_from, amenities, latitude, longitude) VALUES
('Ubud Jungle Retreat', 'Breathtaking eco-luxury resort nestled in the Balinese jungle with rice terrace views and traditional architecture.', 'Bali', 'Indonesia', 'Jalan Raya Ubud, Ubud, Gianyar, Bali 80571', 4,
 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800,https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
 120.00, 'WiFi,Infinity Pool,Spa,Yoga,Restaurant,Shuttle,Rice Terrace Views', -8.5069, 115.2625);

INSERT INTO rooms (hotel_id, room_number, type, price_per_night, max_occupancy, description, is_available, amenities, image_urls) VALUES
((SELECT id FROM hotels WHERE name='Ubud Jungle Retreat'), 'U101', 'SINGLE', 120.00, 1, 'Traditional Joglo villa with rice terrace views and outdoor shower.', TRUE, 'WiFi,AC,Outdoor Shower,Yoga Mat', 'https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800'),
((SELECT id FROM hotels WHERE name='Ubud Jungle Retreat'), 'U201', 'DOUBLE', 190.00, 2, 'Jungle villa with private plunge pool and open-air living area.', TRUE, 'WiFi,AC,Private Plunge Pool,Outdoor Shower', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'),
((SELECT id FROM hotels WHERE name='Ubud Jungle Retreat'), 'U301', 'SUITE', 380.00, 4, 'Royal villa with two bedrooms, private pool, and dedicated butler service.', TRUE, 'WiFi,AC,Private Pool,Butler Service,Outdoor Dining', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800');

INSERT INTO hotels (name, description, city, country, address, star_rating, image_urls, price_from, amenities, latitude, longitude) VALUES
('Harbour View Sydney', 'Contemporary hotel with unobstructed views of the Sydney Opera House and Harbour Bridge from every room.', 'Sydney', 'Australia', '93 Macquarie Street, Sydney NSW 2000', 4,
 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800,https://images.unsplash.com/photo-1495562569060-2eec283d3391?w=800',
 200.00, 'WiFi,Rooftop Pool,Restaurant,Bar,Gym,Concierge', -33.8688, 151.2093);

INSERT INTO rooms (hotel_id, room_number, type, price_per_night, max_occupancy, description, is_available, amenities, image_urls) VALUES
((SELECT id FROM hotels WHERE name='Harbour View Sydney'), 'H101', 'SINGLE', 200.00, 1, 'Modern single room with Opera House views and contemporary design.', TRUE, 'WiFi,TV,Safe,Mini Bar', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800'),
((SELECT id FROM hotels WHERE name='Harbour View Sydney'), 'H201', 'DOUBLE', 320.00, 2, 'Spacious double room with floor-to-ceiling harbour views.', TRUE, 'WiFi,TV,Safe,Mini Bar,Harbour View', 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'),
((SELECT id FROM hotels WHERE name='Harbour View Sydney'), 'H301', 'SUITE', 580.00, 3, 'Penthouse suite spanning the entire top floor with 360° harbour panorama.', TRUE, 'WiFi,TV,Safe,Mini Bar,Jacuzzi,360 View,Dining Area', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800');

INSERT INTO hotels (name, description, city, country, address, star_rating, image_urls, price_from, amenities, latitude, longitude) VALUES
('Villa Roma Imperiale', 'Grand historic hotel steps from the Colosseum, featuring frescoed ceilings, a rooftop terrace, and Michelin-starred dining.', 'Rome', 'Italy', 'Via Sacra 12, 00184 Roma RM', 5,
 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800,https://images.unsplash.com/photo-1534008897995-27a23e859048?w=800',
 240.00, 'WiFi,Rooftop Terrace,Michelin Restaurant,Spa,Art Gallery,Concierge', 41.8902, 12.4922);

INSERT INTO rooms (hotel_id, room_number, type, price_per_night, max_occupancy, description, is_available, amenities, image_urls) VALUES
((SELECT id FROM hotels WHERE name='Villa Roma Imperiale'), 'R101', 'SINGLE', 240.00, 1, 'Classical Roman room with original frescoes and Colosseum views.', TRUE, 'WiFi,TV,Safe,Mini Bar', 'https://images.unsplash.com/photo-1631049552057-403cdb8f0658?w=800'),
((SELECT id FROM hotels WHERE name='Villa Roma Imperiale'), 'R201', 'DOUBLE', 360.00, 2, 'Palatial double room with Baroque furnishings and private terrace.', TRUE, 'WiFi,TV,Safe,Mini Bar,Private Terrace', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'),
((SELECT id FROM hotels WHERE name='Villa Roma Imperiale'), 'R501', 'SUITE', 820.00, 4, 'Imperial suite with original Roman artifacts, roof garden, and chef service.', TRUE, 'WiFi,TV,Safe,Mini Bar,Roof Garden,Private Chef,Roman Artifacts', 'https://images.unsplash.com/photo-1574643156929-51fa098b0394?w=800');

INSERT INTO hotels (name, description, city, country, address, star_rating, image_urls, price_from, amenities, latitude, longitude) VALUES
('Hotel Gaudí Barcelona', 'Design-forward hotel in the Gothic Quarter, inspired by Gaudí''s architecture with vibrant colors and Mediterranean flair.', 'Barcelona', 'Spain', 'Carrer de la Boqueria 27, 08002 Barcelona', 4,
 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800,https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800',
 160.00, 'WiFi,Rooftop Pool,Tapas Bar,Gym,Bike Rental,Concierge', 41.3851, 2.1734);

INSERT INTO rooms (hotel_id, room_number, type, price_per_night, max_occupancy, description, is_available, amenities, image_urls) VALUES
((SELECT id FROM hotels WHERE name='Hotel Gaudí Barcelona'), 'B101', 'SINGLE', 160.00, 1, 'Artistic single room with mosaic tiles and Gothic Quarter views.', TRUE, 'WiFi,TV,Safe,AC', 'https://images.unsplash.com/photo-1567201080580-bfcc97dae346?w=800'),
((SELECT id FROM hotels WHERE name='Hotel Gaudí Barcelona'), 'B201', 'DOUBLE', 250.00, 2, 'Vibrant double room with private terrace overlooking Las Ramblas.', TRUE, 'WiFi,TV,Safe,AC,Private Terrace', 'https://images.unsplash.com/photo-1560624052-449f5ddf0c31?w=800'),
((SELECT id FROM hotels WHERE name='Hotel Gaudí Barcelona'), 'B301', 'SUITE', 480.00, 3, 'Artistic suite inspired by Park Güell with rooftop pool access.', TRUE, 'WiFi,TV,Safe,AC,Rooftop Pool Access,Champagne', 'https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800');

INSERT INTO hotels (name, description, city, country, address, star_rating, image_urls, price_from, amenities, latitude, longitude) VALUES
('Marina Bay Prestige', 'Iconic hotel overlooking Marina Bay Sands with an infinity pool, luxury shopping, and spectacular Gardens by the Bay views.', 'Singapore', 'Singapore', '10 Bayfront Avenue, Singapore 018956', 5,
 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800,https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
 380.00, 'WiFi,Infinity Pool,Casino,Multiple Restaurants,Spa,Shopping Mall', 1.2834, 103.8607);

INSERT INTO rooms (hotel_id, room_number, type, price_per_night, max_occupancy, description, is_available, amenities, image_urls) VALUES
((SELECT id FROM hotels WHERE name='Marina Bay Prestige'), 'M101', 'DOUBLE', 380.00, 2, 'Premium room with stunning Marina Bay views and city skyline at night.', TRUE, 'WiFi,TV,Safe,Mini Bar,City View', 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800'),
((SELECT id FROM hotels WHERE name='Marina Bay Prestige'), 'M201', 'DELUXE', 560.00, 2, 'Deluxe room with infinity pool access and personal butler service.', TRUE, 'WiFi,TV,Safe,Mini Bar,Pool Access,Butler Service', 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800'),
((SELECT id FROM hotels WHERE name='Marina Bay Prestige'), 'M501', 'SUITE', 1200.00, 4, 'Sky suite with private infinity pool, bay views, and dedicated concierge team.', TRUE, 'WiFi,TV,Safe,Private Pool,Concierge Team,All Dining Included', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800');
