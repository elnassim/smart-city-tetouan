-- =====================================================
-- WATER & ELECTRICITY MANAGEMENT SYSTEM
-- Smart City Tetouan
-- Claims limited to:
--  - Problème Eau (Fuite / Vanne)
--  - Problème Électrique (Smart Grid)
-- =====================================================

CREATE DATABASE IF NOT EXISTS water_electricity_management;
USE water_electricity_management;

-- =====================================================
-- USERS (Clerk-based)
-- =====================================================
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    clerk_user_id VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(30),
    role ENUM('ADMIN','CITOYEN','OPERATOR') DEFAULT 'CITOYEN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- METERS / CAPTEURS
-- =====================================================
CREATE TABLE meters (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    meter_number VARCHAR(50) UNIQUE NOT NULL,
    user_id BIGINT NOT NULL,
    type ENUM('WATER','ELECTRICITY') NOT NULL,
    location_address TEXT,
    latitude DECIMAL(10,7),
    longitude DECIMAL(10,7),
    status ENUM('ACTIVE','INACTIVE','MAINTENANCE') DEFAULT 'ACTIVE',
    installed_at DATE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- =====================================================
-- SENSOR READINGS
-- =====================================================
CREATE TABLE meter_readings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    meter_id BIGINT NOT NULL,
    reading_value DECIMAL(10,2) NOT NULL,
    reading_date DATETIME NOT NULL,
    source ENUM('MANUAL','SMART') DEFAULT 'SMART',
    FOREIGN KEY (meter_id) REFERENCES meters(id)
);

-- =====================================================
-- CONSUMPTION SUMMARY
-- =====================================================
CREATE TABLE consumption_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    meter_id BIGINT NOT NULL,
    period_start DATE,
    period_end DATE,
    total_consumption DECIMAL(10,2),
    FOREIGN KEY (meter_id) REFERENCES meters(id)
);

-- =====================================================
-- BILLING
-- =====================================================
CREATE TABLE bills (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    bill_number VARCHAR(50) UNIQUE NOT NULL,
    user_id BIGINT NOT NULL,
    meter_id BIGINT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status ENUM('PENDING','PAID','OVERDUE') DEFAULT 'PENDING',
    due_date DATE,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (meter_id) REFERENCES meters(id)
);

-- =====================================================
-- PAYMENTS
-- =====================================================
CREATE TABLE payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    bill_id BIGINT NOT NULL,
    payment_method ENUM('CARD','ONLINE','BANK_TRANSFER'),
    transaction_reference VARCHAR(100),
    amount DECIMAL(10,2),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bill_id) REFERENCES bills(id)
);

-- =====================================================
-- CLAIMS (ONLY WATER & ELECTRICITY ISSUES)
-- =====================================================
CREATE TABLE claims (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    claim_id CHAR(36) UNIQUE NOT NULL,
    claim_number VARCHAR(50) UNIQUE NOT NULL,
    correlation_id CHAR(36),
    user_id BIGINT NOT NULL,

    claim_type ENUM(
        'WATER_LEAK',
        'WATER_VALVE',
        'ELECTRICITY_SMART_GRID'
    ) NOT NULL,

    title VARCHAR(255),
    description TEXT,
    priority ENUM('low','medium','high') DEFAULT 'medium',

    status ENUM(
        'submitted',
        'received',
        'assigned',
        'in_progress',
        'pending_info',
        'rejected',
        'resolved'
    ) DEFAULT 'submitted',

    address TEXT,
    latitude DECIMAL(10,7),
    longitude DECIMAL(10,7),

    service_reference VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- =====================================================
-- CLAIM EXTRA DATA (meterNumber, accountNumber, etc.)
-- =====================================================
CREATE TABLE claim_extra_data (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    claim_id BIGINT,
    data_key VARCHAR(100),
    data_value VARCHAR(255),
    FOREIGN KEY (claim_id) REFERENCES claims(id) ON DELETE CASCADE
);

-- =====================================================
-- CLAIM MESSAGES
-- =====================================================
CREATE TABLE claim_messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    message_id CHAR(36),
    claim_id BIGINT,
    sender_type ENUM('CITOYEN','OPERATOR','SYSTEM'),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (claim_id) REFERENCES claims(id) ON DELETE CASCADE
);

-- =====================================================
-- ATTACHMENTS
-- =====================================================
CREATE TABLE attachments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    claim_id BIGINT,
    message_id BIGINT,
    file_url TEXT,
    file_name VARCHAR(255),
    file_type VARCHAR(100),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (claim_id) REFERENCES claims(id) ON DELETE CASCADE,
    FOREIGN KEY (message_id) REFERENCES claim_messages(id) ON DELETE CASCADE
);

-- =====================================================
-- CLAIM STATUS HISTORY
-- =====================================================
CREATE TABLE claim_status_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    claim_id BIGINT,
    previous_status VARCHAR(50),
    new_status VARCHAR(50),
    reason TEXT,
    operator_id VARCHAR(50),
    operator_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (claim_id) REFERENCES claims(id) ON DELETE CASCADE
);

-- =====================================================
-- CLAIM RESOLUTION
-- =====================================================
CREATE TABLE claim_resolutions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    claim_id BIGINT UNIQUE,
    summary TEXT,
    actions_taken JSON,
    closing_message TEXT,
    resolved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (claim_id) REFERENCES claims(id) ON DELETE CASCADE
);

-- =====================================================
-- NOTIFICATIONS
-- =====================================================
CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    title VARCHAR(255),
    message TEXT,
    type ENUM('INFO','ALERT','BILLING','CLAIM'),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- =====================================================
-- INFRASTRUCTURE STATUS
-- =====================================================
CREATE TABLE infrastructure_status (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    component_name VARCHAR(100),
    service_type ENUM('WATER','ELECTRICITY'),
    status ENUM('OPERATIONAL','DOWN','MAINTENANCE'),
    last_checked TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- KAFKA EVENT LOG
-- =====================================================
CREATE TABLE kafka_event_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    message_id CHAR(36),
    topic VARCHAR(100),
    message_type VARCHAR(100),
    payload JSON,
    received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX idx_user_clerk ON users(clerk_user_id);
CREATE INDEX idx_claim_status ON claims(status);
CREATE INDEX idx_claim_type ON claims(claim_type);
CREATE INDEX idx_meter_user ON meters(user_id);
CREATE INDEX idx_bill_user ON bills(user_id);
CREATE INDEX idx_notification_user ON notifications(user_id);
USE mysql;
