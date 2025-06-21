-- Export data from Cloud SQL for Supabase migration
-- This script exports the schema and data in a format compatible with Supabase

-- Export categories
\echo 'Exporting categories...'
\copy (SELECT * FROM categories ORDER BY parent_id NULLS FIRST, id) TO 'categories.csv' WITH CSV HEADER;

-- Export equipment
\echo 'Exporting equipment...'
\copy (SELECT * FROM equipment ORDER BY id) TO 'equipment.csv' WITH CSV HEADER;

-- Export rate_cards
\echo 'Exporting rate_cards...'
\copy (SELECT * FROM rate_cards ORDER BY id) TO 'rate_cards.csv' WITH CSV HEADER;

-- Export services
\echo 'Exporting services...'
\copy (SELECT * FROM services ORDER BY id) TO 'services.csv' WITH CSV HEADER;

\echo 'Export complete!' 