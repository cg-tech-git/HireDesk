-- Import data into Supabase
-- Run this after creating the schema

-- Temporarily disable triggers
SET session_replication_role = 'replica';

-- Import categories (parent categories first)
\copy categories FROM 'categories.csv' WITH CSV HEADER;

-- Import equipment
\copy equipment FROM 'equipment.csv' WITH CSV HEADER;

-- Import rate cards
\copy rate_cards FROM 'rate_cards.csv' WITH CSV HEADER;

-- Import services
\copy services FROM 'services.csv' WITH CSV HEADER;

-- Re-enable triggers
SET session_replication_role = 'origin';

-- Update sequences
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));
SELECT setval('equipment_id_seq', (SELECT MAX(id) FROM equipment));
SELECT setval('rate_cards_id_seq', (SELECT MAX(id) FROM rate_cards));
SELECT setval('services_id_seq', (SELECT MAX(id) FROM services));

-- Verify import
SELECT 'Categories:' as table_name, COUNT(*) as count FROM categories
UNION ALL
SELECT 'Equipment:', COUNT(*) FROM equipment
UNION ALL
SELECT 'Rate Cards:', COUNT(*) FROM rate_cards
UNION ALL
SELECT 'Services:', COUNT(*) FROM services;
