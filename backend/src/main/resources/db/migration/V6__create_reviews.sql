CREATE TABLE IF NOT EXISTS reviews (
    id            BIGSERIAL    PRIMARY KEY,
    clerk_user_id VARCHAR(255) NOT NULL,
    hotel_id      BIGINT       NOT NULL REFERENCES hotels (id) ON DELETE CASCADE,
    rating        INT          NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment       TEXT,
    reviewer_name VARCHAR(255),
    created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_hotel_review UNIQUE (clerk_user_id, hotel_id)
);

CREATE INDEX IF NOT EXISTS idx_review_hotel_id ON reviews (hotel_id);
