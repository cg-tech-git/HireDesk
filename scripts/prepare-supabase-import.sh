#!/bin/bash

echo "Preparing data for Supabase import..."

# Create import directory
mkdir -p supabase-import

# Copy CSV files
cp categories.csv supabase-import/
cp equipment.csv supabase-import/
cp rate_cards.csv supabase-import/
cp services.csv supabase-import/

# Create combined SQL import script
cat > supabase-import/import-data.sql << 'EOF'
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
EOF

echo "Import files prepared in supabase-import/"
echo ""
echo "Next steps:"
echo "1. Create your Supabase project"
echo "2. Run the schema script (init-db.sql) in SQL Editor"
echo "3. Import the CSV files via Table Editor or SQL"
echo ""
echo "Files ready:"
ls -la supabase-import/ 