UPDATE hotels SET price_from = price_from * 80 WHERE price_from < 2000;
UPDATE rooms SET price_per_night = price_per_night * 80 WHERE price_per_night < 2000;

INSERT INTO hotels (name, description, city, country, address, star_rating, image_urls, price_from, amenities, latitude, longitude) VALUES
('The Taj Mahal Palace', 
 'Legendary landmark hotel overlooking the Gateway of India and the Arabian Sea. A timeless symbol of Indian hospitality since 1903 with 9 acclaimed restaurants and the lavish Jiva Spa.', 
 'Mumbai', 'India', 'Apollo Bunder, Colaba, Mumbai, Maharashtra 400001', 5,
 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800,https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
 24000.00, 'WiFi,Swimming Pool,Jiva Spa,Sea View Dining,Harbour Lounge,Valet Parking,Concierge,24/7 Butler Service', 18.9217, 72.8332),

('The Leela Palace', 
 'Grand modern palace nestled in the prestigious Diplomatic Enclave. Combines royal Lutyens architecture with contemporary luxury, Michelin-star dining, and a stunning rooftop infinity pool.', 
 'New Delhi', 'India', 'Diplomatic Enclave, Chanakyapuri, New Delhi, Delhi 110023', 5,
 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800,https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
 22000.00, 'WiFi,Rooftop Infinity Pool,ESPA Spa,Michelin Dining,Royal Club Lounge,Concierge,Helipad Access', 28.5833, 77.1895),

('Rambagh Palace', 
 'The "Jewel of Jaipur", former royal residence of the Maharaja of Jaipur. Features 47 acres of tranquil landscaped gardens, marble corridors, peacock lawns, and authentic royal hospitality.', 
 'Jaipur', 'India', 'Bhawani Singh Road, Jaipur, Rajasthan 302005', 5,
 'https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800,https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
 38000.00, 'WiFi,Heritage Gardens,Royal Jiva Spa,Polo Bar,Peacocks on Lawns,Vintage Car Escort,Outdoor Pool,Palace Butler', 26.8967, 75.8083),

('Taj Exotica Resort & Spa', 
 'Mediterranean-inspired beach sanctuary set across 56 acres of lush gardens along Benaulim Beach in South Goa. Unwind with ocean-view cabanas, private plunge pools, and world-class seafood.', 
 'Goa', 'India', 'Calwaddo, Benaulim, Salcete, Goa 403716', 5,
 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800,https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800',
 18500.00, 'WiFi,Private Beach Access,Jiva Spa,Beachfront Dining,Watersports,Infinity Pool,Ayurveda Sanctuary,Golf Putting', 15.2530, 73.9160),

('The Oberoi Udaivilas', 
 'Spectacular palace resort on the romantic banks of Lake Pichola with views of the City Palace. Boasts Mewar architecture, private lake boat arrival, decorative domes, and semi-private pool pavilions.', 
 'Udaipur', 'India', 'Haridas Ji Ki Magri, Mulla Talai, Udaipur, Rajasthan 313001', 5,
 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800,https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800',
 42000.00, 'WiFi,Lake Boat Arrival,Royal Spa,Semi-Private Pool,Lake View Pavilions,Fine Dining,Yoga Classes,Butler Service', 24.5772, 73.6738),

('ITC Grand Chola', 
 'Magnificent tribute to the golden age of Southern India''s Chola dynasty. Renowned for its grand marble architecture, 10 iconic culinary destinations, and LEED Platinum sustainable luxury.', 
 'Chennai', 'India', 'No. 63, Mount Road, Guindy, Chennai, Tamil Nadu 600032', 5,
 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800,https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
 14000.00, 'WiFi,10 Restaurants,Kaya Kalp Spa,3 Swimming Pools,Luxury Shopping,Helipad,Valet Parking,Concierge', 13.0102, 80.2157);

INSERT INTO rooms (hotel_id, room_number, type, price_per_night, max_occupancy, description, is_available, amenities, image_urls) VALUES
((SELECT id FROM hotels WHERE name='The Taj Mahal Palace'), 'T101', 'DELUXE', 24000.00, 2, 'Deluxe Sea View Room with sweeping panoramas of the Gateway of India and the Arabian Sea.', TRUE, 'WiFi,TV,Mini Bar,Safe,Sea View,Bathtub', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'),
((SELECT id FROM hotels WHERE name='The Taj Mahal Palace'), 'T201', 'DOUBLE', 35000.00, 2, 'Luxury Grande Room in the iconic Palace Heritage Wing with handcrafted Victorian rosewood furniture.', TRUE, 'WiFi,TV,Mini Bar,Safe,Sea View,Bathtub,Butler Service', 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'),
((SELECT id FROM hotels WHERE name='The Taj Mahal Palace'), 'T501', 'SUITE', 75000.00, 4, 'Presidential Heritage Suite with marble dining salon, private jacuzzi, and dedicated 24/7 butler.', TRUE, 'WiFi,TV,Mini Bar,Safe,Jacuzzi,Butler Service,Dining Room,Champagne Welcome', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'),

((SELECT id FROM hotels WHERE name='The Leela Palace'), 'L102', 'DELUXE', 22000.00, 2, 'Grand Deluxe Room featuring opulent handwoven Indian tapestries and soundproof city-view glass.', TRUE, 'WiFi,TV,Safe,Mini Bar,Marble Bath', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'),
((SELECT id FROM hotels WHERE name='The Leela Palace'), 'L202', 'DOUBLE', 32000.00, 2, 'Royal Premier Room with Diplomatic Enclave gardens view, soaking tub, and Royal Club access.', TRUE, 'WiFi,TV,Safe,Mini Bar,Club Lounge Access,Bathtub', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800'),
((SELECT id FROM hotels WHERE name='The Leela Palace'), 'L502', 'SUITE', 68000.00, 3, 'Executive Palace Suite with private balcony terrace, walk-in dressing room, and luxury Bulgari toiletries.', TRUE, 'WiFi,TV,Safe,Jacuzzi,Terrace,Butler Service,Bulgari Toiletries', 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800'),

((SELECT id FROM hotels WHERE name='Rambagh Palace'), 'R103', 'DELUXE', 38000.00, 2, 'Palace Room with authentic Rajasthani jharokha architecture, four-poster bed, and garden breezes.', TRUE, 'WiFi,TV,Safe,Mini Bar,Heritage Courtyard View', 'https://images.unsplash.com/photo-1631049552057-403cdb8f0658?w=800'),
((SELECT id FROM hotels WHERE name='Rambagh Palace'), 'R203', 'SUITE', 55000.00, 3, 'Historical Royal Suite formerly hosting visiting dignitaries, adorned with heritage royal portraits.', TRUE, 'WiFi,TV,Safe,Mini Bar,Roll-top Bath,Palace Butler', 'https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800'),
((SELECT id FROM hotels WHERE name='Rambagh Palace'), 'R503', 'SUITE', 110000.00, 4, 'Grand Maharani Suite with arched ceiling frescoes, crystal chandeliers, and private terrace banquet area.', TRUE, 'WiFi,TV,Safe,Jacuzzi,Private Butler,Royal Carriage Ride,Vintage Champagne', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'),

((SELECT id FROM hotels WHERE name='Taj Exotica Resort & Spa'), 'G104', 'DELUXE', 18500.00, 2, 'Garden Villa with private sit-out verandah surrounded by tropical palms and sea breeze.', TRUE, 'WiFi,TV,Safe,Private Balcony,Garden View', 'https://images.unsplash.com/photo-1541971875076-8f970d573be6?w=800'),
((SELECT id FROM hotels WHERE name='Taj Exotica Resort & Spa'), 'G204', 'DOUBLE', 28000.00, 3, 'Premium Sea View Villa just 50 meters from the sands of Benaulim Beach with sunset vistas.', TRUE, 'WiFi,TV,Safe,Sea View,Beach Path,Bathtub', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'),
((SELECT id FROM hotels WHERE name='Taj Exotica Resort & Spa'), 'G504', 'SUITE', 58000.00, 4, 'Presidential Plunge Pool Villa featuring a private open-air swimming pool and direct beach gate.', TRUE, 'WiFi,TV,Safe,Private Pool,Direct Beach Access,Butler Service', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'),

((SELECT id FROM hotels WHERE name='The Oberoi Udaivilas'), 'U105', 'DELUXE', 42000.00, 2, 'Premier Room with private courtyard garden and views of the Mewar wildlife reserve.', TRUE, 'WiFi,TV,Safe,Courtyard,Soaking Tub', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'),
((SELECT id FROM hotels WHERE name='The Oberoi Udaivilas'), 'U205', 'DOUBLE', 60000.00, 2, 'Premier Room with direct access to the semi-private moat swimming pool and Lake Pichola views.', TRUE, 'WiFi,TV,Safe,Semi-Private Pool Access,Lake View,Boat Transfer', 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800'),
((SELECT id FROM hotels WHERE name='The Oberoi Udaivilas'), 'U505', 'SUITE', 125000.00, 4, 'Kohinoor Luxury Suite with private outdoor heated pool, Lake Pichola pavilions, and personal chef service.', TRUE, 'WiFi,TV,Safe,Private Pool,Private Chef,Personal Butler,Royal Lake Pavilion', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'),

((SELECT id FROM hotels WHERE name='ITC Grand Chola'), 'C106', 'SINGLE', 14000.00, 1, 'Executive Club Room featuring state-of-the-art iPad controls and ergonomic work sanctuary.', TRUE, 'WiFi,TV,Safe,Ergonomic Desk,Marble Bath', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'),
((SELECT id FROM hotels WHERE name='ITC Grand Chola'), 'C206', 'DOUBLE', 22000.00, 2, 'Towers Room with complimentary evening cocktail reception in the exclusive Towers Lounge.', TRUE, 'WiFi,TV,Safe,Towers Lounge Access,Bathtub', 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'),
((SELECT id FROM hotels WHERE name='ITC Grand Chola'), 'C506', 'SUITE', 48000.00, 3, 'Chola Grand Suite with formal living room, four-fixture bathroom, and deep soaking tub.', TRUE, 'WiFi,TV,Safe,Dining Area,Jacuzzi,Chauffeur Airport Transfer', 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800');
