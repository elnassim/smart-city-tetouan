-- =====================================================
-- SAMPLE DATA FOR SMART CITY TETOUAN
-- =====================================================

USE water_electricity_management;

-- =====================================================
-- 1. UPDATE EXISTING USERS FROM CLERK
-- =====================================================
-- NOTE: These users already exist in your database from Clerk webhook
-- We just need to update user ID 1 to be ADMIN

-- Make Wassim (user_37GTcO1M4yh4zQAT1qdaTRKGxfP) an admin
UPDATE users SET role = 'ADMIN', phone = '+212 6 12 34 56 78'
WHERE clerk_user_id = 'user_37GTcO1M4yh4zQAT1qdaTRKGxfP';

-- Update Soulayman's phone (optional)
UPDATE users SET phone = '+212 6 11 22 33 44'
WHERE clerk_user_id = 'user_37GdZi9D6fP6dIbNkNHqIDNwkiM';

-- Note: User IDs in database are:
-- ID 1: user_37GTcO1M4yh4zQAT1qdaTRKGxfP (Wassim el kaddaoui) - NOW ADMIN
-- ID 2: user_37GdZi9D6fP6dIbNkNHqIDNwkiM (soulayman soulayman) - CITOYEN

-- =====================================================
-- 2. CREATE METERS FOR USERS
-- =====================================================
INSERT INTO meters (meter_number, user_id, type, location_address, latitude, longitude, status, installed_at) 
VALUES 
-- User 1 (Wassim el kaddaoui - ADMIN)
('WAT-TET-001', 1, 'WATER', 'Avenue Hassan II, Tétouan', 35.578329, -5.368421, 'ACTIVE', '2023-01-15'),
('ELEC-TET-001', 1, 'ELECTRICITY', 'Avenue Hassan II, Tétouan', 35.578329, -5.368421, 'ACTIVE', '2023-01-15');

-- User 2 (Soulayman soulayman - CITOYEN)
INSERT INTO meters (meter_number, user_id, type, location_address, latitude, longitude, status, installed_at) 
VALUES 
('WAT-TET-002', 2, 'WATER', 'Rue Moulay Ismail, Tétouan', 35.572445, -5.361987, 'ACTIVE', '2023-02-20'),
('ELEC-TET-002', 2, 'ELECTRICITY', 'Rue Moulay Ismail, Tétouan', 35.572445, -5.361987, 'ACTIVE', '2023-02-20');

-- =====================================================
-- 3. CREATE METER READINGS (LAST 30 DAYS)
-- =====================================================
-- Water readings for meter 1 (Wassim el kaddaoui - Water)
INSERT INTO meter_readings (meter_id, reading_value, reading_date, source) VALUES
(1, 1.2, DATE_SUB(NOW(), INTERVAL 29 DAY), 'SMART'),
(1, 1.5, DATE_SUB(NOW(), INTERVAL 28 DAY), 'SMART'),
(1, 1.8, DATE_SUB(NOW(), INTERVAL 27 DAY), 'SMART'),
(1, 1.6, DATE_SUB(NOW(), INTERVAL 26 DAY), 'SMART'),
(1, 2.1, DATE_SUB(NOW(), INTERVAL 25 DAY), 'SMART'),
(1, 1.9, DATE_SUB(NOW(), INTERVAL 24 DAY), 'SMART'),
(1, 1.7, DATE_SUB(NOW(), INTERVAL 23 DAY), 'SMART'),
(1, 2.0, DATE_SUB(NOW(), INTERVAL 22 DAY), 'SMART'),
(1, 1.4, DATE_SUB(NOW(), INTERVAL 21 DAY), 'SMART'),
(1, 1.8, DATE_SUB(NOW(), INTERVAL 20 DAY), 'SMART'),
(1, 1.6, DATE_SUB(NOW(), INTERVAL 19 DAY), 'SMART'),
(1, 2.2, DATE_SUB(NOW(), INTERVAL 18 DAY), 'SMART'),
(1, 1.5, DATE_SUB(NOW(), INTERVAL 17 DAY), 'SMART'),
(1, 1.9, DATE_SUB(NOW(), INTERVAL 16 DAY), 'SMART'),
(1, 1.7, DATE_SUB(NOW(), INTERVAL 15 DAY), 'SMART'),
(1, 1.8, DATE_SUB(NOW(), INTERVAL 14 DAY), 'SMART'),
(1, 2.0, DATE_SUB(NOW(), INTERVAL 13 DAY), 'SMART'),
(1, 1.6, DATE_SUB(NOW(), INTERVAL 12 DAY), 'SMART'),
(1, 2.1, DATE_SUB(NOW(), INTERVAL 11 DAY), 'SMART'),
(1, 1.9, DATE_SUB(NOW(), INTERVAL 10 DAY), 'SMART'),
(1, 1.7, DATE_SUB(NOW(), INTERVAL 9 DAY), 'SMART'),
(1, 2.0, DATE_SUB(NOW(), INTERVAL 8 DAY), 'SMART'),
(1, 1.8, DATE_SUB(NOW(), INTERVAL 7 DAY), 'SMART'),
(1, 1.6, DATE_SUB(NOW(), INTERVAL 6 DAY), 'SMART'),
(1, 2.1, DATE_SUB(NOW(), INTERVAL 5 DAY), 'SMART'),
(1, 1.9, DATE_SUB(NOW(), INTERVAL 4 DAY), 'SMART'),
(1, 1.7, DATE_SUB(NOW(), INTERVAL 3 DAY), 'SMART'),
(1, 2.0, DATE_SUB(NOW(), INTERVAL 2 DAY), 'SMART'),
(1, 1.4, DATE_SUB(NOW(), INTERVAL 1 DAY), 'SMART');

-- Electricity readings for meter 2 (Wassim el kaddaoui - Electricity)
INSERT INTO meter_readings (meter_id, reading_value, reading_date, source) VALUES
(2, 35, DATE_SUB(NOW(), INTERVAL 29 DAY), 'SMART'),
(2, 38, DATE_SUB(NOW(), INTERVAL 28 DAY), 'SMART'),
(2, 42, DATE_SUB(NOW(), INTERVAL 27 DAY), 'SMART'),
(2, 45, DATE_SUB(NOW(), INTERVAL 26 DAY), 'SMART'),
(2, 40, DATE_SUB(NOW(), INTERVAL 25 DAY), 'SMART'),
(2, 41, DATE_SUB(NOW(), INTERVAL 24 DAY), 'SMART'),
(2, 48, DATE_SUB(NOW(), INTERVAL 23 DAY), 'SMART'),
(2, 31, DATE_SUB(NOW(), INTERVAL 22 DAY), 'SMART'),
(2, 38, DATE_SUB(NOW(), INTERVAL 21 DAY), 'SMART'),
(2, 42, DATE_SUB(NOW(), INTERVAL 20 DAY), 'SMART'),
(2, 45, DATE_SUB(NOW(), INTERVAL 19 DAY), 'SMART'),
(2, 40, DATE_SUB(NOW(), INTERVAL 18 DAY), 'SMART'),
(2, 41, DATE_SUB(NOW(), INTERVAL 17 DAY), 'SMART'),
(2, 48, DATE_SUB(NOW(), INTERVAL 16 DAY), 'SMART'),
(2, 31, DATE_SUB(NOW(), INTERVAL 15 DAY), 'SMART'),
(2, 38, DATE_SUB(NOW(), INTERVAL 14 DAY), 'SMART'),
(2, 42, DATE_SUB(NOW(), INTERVAL 13 DAY), 'SMART'),
(2, 45, DATE_SUB(NOW(), INTERVAL 12 DAY), 'SMART'),
(2, 40, DATE_SUB(NOW(), INTERVAL 11 DAY), 'SMART'),
(2, 41, DATE_SUB(NOW(), INTERVAL 10 DAY), 'SMART'),
(2, 48, DATE_SUB(NOW(), INTERVAL 9 DAY), 'SMART'),
(2, 31, DATE_SUB(NOW(), INTERVAL 8 DAY), 'SMART'),
(2, 38, DATE_SUB(NOW(), INTERVAL 7 DAY), 'SMART'),
(2, 42, DATE_SUB(NOW(), INTERVAL 6 DAY), 'SMART'),
(2, 45, DATE_SUB(NOW(), INTERVAL 5 DAY), 'SMART'),
(2, 40, DATE_SUB(NOW(), INTERVAL 4 DAY), 'SMART'),
(2, 41, DATE_SUB(NOW(), INTERVAL 3 DAY), 'SMART'),
(2, 48, DATE_SUB(NOW(), INTERVAL 2 DAY), 'SMART'),
(2, 31, DATE_SUB(NOW(), INTERVAL 1 DAY), 'SMART');

-- Water readings for meter 3 (Soulayman soulayman - Water)
INSERT INTO meter_readings (meter_id, reading_value, reading_date, source) VALUES
(3, 1.3, DATE_SUB(NOW(), INTERVAL 29 DAY), 'SMART'),
(3, 1.6, DATE_SUB(NOW(), INTERVAL 28 DAY), 'SMART'),
(3, 1.9, DATE_SUB(NOW(), INTERVAL 27 DAY), 'SMART'),
(3, 1.7, DATE_SUB(NOW(), INTERVAL 26 DAY), 'SMART'),
(3, 2.2, DATE_SUB(NOW(), INTERVAL 25 DAY), 'SMART'),
(3, 2.0, DATE_SUB(NOW(), INTERVAL 24 DAY), 'SMART'),
(3, 1.8, DATE_SUB(NOW(), INTERVAL 23 DAY), 'SMART'),
(3, 2.1, DATE_SUB(NOW(), INTERVAL 22 DAY), 'SMART'),
(3, 1.5, DATE_SUB(NOW(), INTERVAL 21 DAY), 'SMART'),
(3, 1.9, DATE_SUB(NOW(), INTERVAL 20 DAY), 'SMART'),
(3, 1.7, DATE_SUB(NOW(), INTERVAL 19 DAY), 'SMART'),
(3, 2.3, DATE_SUB(NOW(), INTERVAL 18 DAY), 'SMART'),
(3, 1.6, DATE_SUB(NOW(), INTERVAL 17 DAY), 'SMART'),
(3, 2.0, DATE_SUB(NOW(), INTERVAL 16 DAY), 'SMART'),
(3, 1.8, DATE_SUB(NOW(), INTERVAL 15 DAY), 'SMART'),
(3, 1.9, DATE_SUB(NOW(), INTERVAL 14 DAY), 'SMART'),
(3, 2.1, DATE_SUB(NOW(), INTERVAL 13 DAY), 'SMART'),
(3, 1.7, DATE_SUB(NOW(), INTERVAL 12 DAY), 'SMART'),
(3, 2.2, DATE_SUB(NOW(), INTERVAL 11 DAY), 'SMART'),
(3, 2.0, DATE_SUB(NOW(), INTERVAL 10 DAY), 'SMART'),
(3, 1.8, DATE_SUB(NOW(), INTERVAL 9 DAY), 'SMART'),
(3, 2.1, DATE_SUB(NOW(), INTERVAL 8 DAY), 'SMART'),
(3, 1.9, DATE_SUB(NOW(), INTERVAL 7 DAY), 'SMART'),
(3, 1.7, DATE_SUB(NOW(), INTERVAL 6 DAY), 'SMART'),
(3, 2.2, DATE_SUB(NOW(), INTERVAL 5 DAY), 'SMART'),
(3, 2.0, DATE_SUB(NOW(), INTERVAL 4 DAY), 'SMART'),
(3, 1.8, DATE_SUB(NOW(), INTERVAL 3 DAY), 'SMART'),
(3, 2.1, DATE_SUB(NOW(), INTERVAL 2 DAY), 'SMART'),
(3, 1.5, DATE_SUB(NOW(), INTERVAL 1 DAY), 'SMART');

-- Electricity readings for meter 4 (Soulayman soulayman - Electricity)
INSERT INTO meter_readings (meter_id, reading_value, reading_date, source) VALUES
(4, 32, DATE_SUB(NOW(), INTERVAL 29 DAY), 'SMART'),
(4, 36, DATE_SUB(NOW(), INTERVAL 28 DAY), 'SMART'),
(4, 40, DATE_SUB(NOW(), INTERVAL 27 DAY), 'SMART'),
(4, 43, DATE_SUB(NOW(), INTERVAL 26 DAY), 'SMART'),
(4, 38, DATE_SUB(NOW(), INTERVAL 25 DAY), 'SMART'),
(4, 39, DATE_SUB(NOW(), INTERVAL 24 DAY), 'SMART'),
(4, 46, DATE_SUB(NOW(), INTERVAL 23 DAY), 'SMART'),
(4, 29, DATE_SUB(NOW(), INTERVAL 22 DAY), 'SMART'),
(4, 36, DATE_SUB(NOW(), INTERVAL 21 DAY), 'SMART'),
(4, 40, DATE_SUB(NOW(), INTERVAL 20 DAY), 'SMART'),
(4, 43, DATE_SUB(NOW(), INTERVAL 19 DAY), 'SMART'),
(4, 38, DATE_SUB(NOW(), INTERVAL 18 DAY), 'SMART'),
(4, 39, DATE_SUB(NOW(), INTERVAL 17 DAY), 'SMART'),
(4, 46, DATE_SUB(NOW(), INTERVAL 16 DAY), 'SMART'),
(4, 29, DATE_SUB(NOW(), INTERVAL 15 DAY), 'SMART'),
(4, 36, DATE_SUB(NOW(), INTERVAL 14 DAY), 'SMART'),
(4, 40, DATE_SUB(NOW(), INTERVAL 13 DAY), 'SMART'),
(4, 43, DATE_SUB(NOW(), INTERVAL 12 DAY), 'SMART'),
(4, 38, DATE_SUB(NOW(), INTERVAL 11 DAY), 'SMART'),
(4, 39, DATE_SUB(NOW(), INTERVAL 10 DAY), 'SMART'),
(4, 46, DATE_SUB(NOW(), INTERVAL 9 DAY), 'SMART'),
(4, 29, DATE_SUB(NOW(), INTERVAL 8 DAY), 'SMART'),
(4, 36, DATE_SUB(NOW(), INTERVAL 7 DAY), 'SMART'),
(4, 40, DATE_SUB(NOW(), INTERVAL 6 DAY), 'SMART'),
(4, 43, DATE_SUB(NOW(), INTERVAL 5 DAY), 'SMART'),
(4, 38, DATE_SUB(NOW(), INTERVAL 4 DAY), 'SMART'),
(4, 39, DATE_SUB(NOW(), INTERVAL 3 DAY), 'SMART'),
(4, 46, DATE_SUB(NOW(), INTERVAL 2 DAY), 'SMART'),
(4, 29, DATE_SUB(NOW(), INTERVAL 1 DAY), 'SMART');

-- =====================================================
-- 4. CREATE BILLS
-- =====================================================
-- First, check if the meters exist
SELECT id, meter_number, user_id FROM meters WHERE id IN (1, 2, 3, 4);

-- Then insert the bills
INSERT INTO bills (bill_number, user_id, meter_id, amount, status, due_date, generated_at) 
VALUES 
-- Bills for Wassim (user 1 - ADMIN)
('BILL-WAT-2024-001', 1, 1, 125.50, 'PENDING', DATE_ADD(NOW(), INTERVAL 15 DAY), NOW()),
('BILL-ELEC-2024-001', 1, 2, 325.25, 'PENDING', DATE_ADD(NOW(), INTERVAL 15 DAY), NOW());

-- Bills for Soulayman (user 2 - CITOYEN)
INSERT INTO bills (bill_number, user_id, meter_id, amount, status, due_date, generated_at) 
VALUES 
('BILL-WAT-2024-002', 2, 3, 98.75, 'PAID', DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 30 DAY)),
('BILL-ELEC-2024-002', 2, 4, 289.00, 'PAID', DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 30 DAY));

-- =====================================================
-- 5. CREATE NOTIFICATIONS/ALERTS
-- =====================================================
INSERT INTO notifications (user_id, title, message, type, is_read, created_at) VALUES
(1, 'Consommation élevée détectée', 'Votre consommation d''eau est 25% plus élevée que d''habitude', 'ALERT', FALSE, DATE_SUB(NOW(), INTERVAL 2 HOUR)),
(1, 'Fuite potentielle', 'Débit constant détecté entre 2h-4h du matin', 'INFO', FALSE, DATE_SUB(NOW(), INTERVAL 5 HOUR)),
(1, 'Facture disponible', 'Votre facture de décembre est prête', 'BILLING', FALSE, DATE_SUB(NOW(), INTERVAL 1 DAY)),
(2, 'Paiement confirmé', 'Votre paiement de 387.75 MAD a été traité avec succès', 'BILLING', TRUE, DATE_SUB(NOW(), INTERVAL 6 DAY)),
(2, 'Maintenance programmée', 'Interruption d''électricité prévue le 30/12 de 9h à 12h', 'INFO', FALSE, DATE_SUB(NOW(), INTERVAL 3 DAY));

-- =====================================================
-- 6. CREATE SAMPLE CLAIMS
-- =====================================================
INSERT INTO claims (claim_id, claim_number, user_id, claim_type, title, description, priority, status, address, created_at) VALUES
(UUID(), 'CLM-2024-001', 1, 'WATER_LEAK', 'Fuite d''eau importante', 'Fuite visible au niveau du compteur principal', 'high', 'in_progress', 'Avenue Hassan II, Tétouan', DATE_SUB(NOW(), INTERVAL 2 DAY)),
(UUID(), 'CLM-2024-002', 2, 'ELECTRICITY_SMART_GRID', 'Problème de connexion smart grid', 'Le compteur intelligent ne transmet plus les données', 'medium', 'submitted', 'Rue Moulay Ismail, Tétouan', DATE_SUB(NOW(), INTERVAL 1 DAY));

-- =====================================================
-- SUMMARY
-- =====================================================
-- This script has created sample data for 2 real users:
--
-- USER 1 (ADMIN):
--   - Clerk ID: user_37GTcO1M4yh4zQAT1qdaTRKGxfP
--   - Name: Wassim el kaddaoui
--   - Email: elkaddaouinassim@gmail.com
--   - Role: ADMIN (updated from CITOYEN)
--   - Meters: WAT-TET-001, ELEC-TET-001
--   - 2 Pending bills (125.50 + 325.25 MAD)
--   - 3 Notifications
--   - 1 Claim (water leak)
--
-- USER 2 (CITOYEN):
--   - Clerk ID: user_37GdZi9D6fP6dIbNkNHqIDNwkiM
--   - Name: soulayman soulayman
--   - Email: elkaddaoui.nassim@etu.uae.ac.ma
--   - Role: CITOYEN
--   - Meters: WAT-TET-002, ELEC-TET-002
--   - 2 Paid bills (98.75 + 289.00 MAD)
--   - 2 Notifications
--   - 1 Claim (smart grid issue)
--
-- ADMIN ACCESS:
--   You can now login with elkaddaouinassim@gmail.com
--   and access the admin dashboard at /admin/dashboard
--
-- =====================================================
