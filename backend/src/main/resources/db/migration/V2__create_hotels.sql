CREATE TABLE IF NOT EXISTS hotels (
    id          BIGSERIAL       PRIMARY KEY,
    name        VARCHAR(255)    NOT NULL,
    description TEXT,
    city        VARCHAR(100)    NOT NULL,
    country     VARCHAR(100)    NOT NULL,
    address     VARCHAR(500),
    star_rating INT             DEFAULT 3,
    image_urls  TEXT,
    price_from  DECIMAL(10, 2)  NOT NULL DEFAULT 0.00,
    amenities   TEXT,
    latitude    DOUBLE PRECISION,
    longitude   DOUBLE PRECISION,
    created_at  TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_city ON hotels (city);
CREATE INDEX IF NOT EXISTS idx_star_rating ON hotels (star_rating);
