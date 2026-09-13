CREATE TABLE IF NOT EXISTS payments (
    id                        BIGSERIAL      PRIMARY KEY,
    booking_id                BIGINT         NOT NULL UNIQUE REFERENCES bookings (id),
    payment_intent_id         VARCHAR(255)   NOT NULL UNIQUE,
    amount                    DECIMAL(10, 2) NOT NULL,
    currency                  VARCHAR(10)    NOT NULL DEFAULT 'usd',
    status                    VARCHAR(50)    NOT NULL DEFAULT 'PENDING',
    created_at                TIMESTAMP      DEFAULT CURRENT_TIMESTAMP
);
