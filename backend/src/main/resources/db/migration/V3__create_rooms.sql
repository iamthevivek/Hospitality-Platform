CREATE TABLE IF NOT EXISTS rooms (
    id               BIGSERIAL      PRIMARY KEY,
    hotel_id         BIGINT         NOT NULL REFERENCES hotels (id) ON DELETE CASCADE,
    room_number      VARCHAR(50)    NOT NULL,
    type             VARCHAR(50)    NOT NULL,
    price_per_night  DECIMAL(10, 2) NOT NULL,
    max_occupancy    INT            NOT NULL DEFAULT 2,
    description      TEXT,
    is_available     BOOLEAN        NOT NULL DEFAULT TRUE,
    amenities        TEXT,
    image_urls       TEXT
);

CREATE INDEX IF NOT EXISTS idx_room_hotel_id ON rooms (hotel_id);
CREATE INDEX IF NOT EXISTS idx_room_is_available ON rooms (is_available);
