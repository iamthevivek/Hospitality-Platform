CREATE TABLE IF NOT EXISTS bookings (
    id                        BIGSERIAL      PRIMARY KEY,
    clerk_user_id             VARCHAR(255)   NOT NULL,
    room_id                   BIGINT         NOT NULL REFERENCES rooms (id),
    check_in_date             DATE           NOT NULL,
    check_out_date            DATE           NOT NULL,
    status                    VARCHAR(50)    NOT NULL DEFAULT 'PENDING',
    total_amount              DECIMAL(10, 2),
    guest_count               INT            NOT NULL DEFAULT 1,
    special_requests          TEXT,
    payment_intent_id         VARCHAR(255),
    created_at                TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    updated_at                TIMESTAMP      DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_clerk_user_id ON bookings (clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_booking_room_id ON bookings (room_id);
CREATE INDEX IF NOT EXISTS idx_booking_status ON bookings (status);
CREATE INDEX IF NOT EXISTS idx_payment_intent_id ON bookings (payment_intent_id);
