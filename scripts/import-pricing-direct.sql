-- Import pricing data directly from CSV values
-- This script imports the HireDesk pricing data into the Cloud SQL database

-- First, create categories
INSERT INTO categories (name, description, is_active) VALUES
('Aerial Work Platforms', 'Equipment category: Aerial Work Platforms', true)
ON CONFLICT DO NOTHING;

-- Create subcategories
INSERT INTO categories (name, description, parent_id, is_active)
SELECT 
    subcategory,
    'Equipment subcategory: ' || subcategory,
    parent.id,
    true
FROM (VALUES 
    ('Electric Scissor Lifts'),
    ('Diesel Scissor Lifts'),
    ('Electric Boom Lifts'),
    ('Telescopic Diesel Boom Lifts'),
    ('Articulated Diesel Boom Lifts'),
    ('Personnel Lifts'),
    ('Material Lifts')
) AS subcats(subcategory)
CROSS JOIN categories parent
WHERE parent.name = 'Aerial Work Platforms' AND parent.parent_id IS NULL
ON CONFLICT DO NOTHING;

-- Insert some sample equipment
INSERT INTO equipment (name, category_id, description, specifications, is_active)
SELECT 
    eq.name,
    cat.id,
    eq.manufacturer || ' ' || eq.name || ' - Professional aerial work platform for construction and industrial applications',
    jsonb_build_object('manufacturer', eq.manufacturer, 'modelId', eq.model_id),
    true
FROM (VALUES
    ('Genie GS-1930', 'Genie', 'GS-1930', 'Electric Scissor Lifts'),
    ('Genie GS-2632', 'Genie', 'GS-2632', 'Electric Scissor Lifts'),
    ('Genie GS-3246', 'Genie', 'GS-3246', 'Electric Scissor Lifts'),
    ('JLG 260MRT', 'JLG', '260MRT', 'Diesel Scissor Lifts'),
    ('Genie Z-45 DC', 'Genie', 'Z-45 DC', 'Electric Boom Lifts'),
    ('JLG 600S', 'JLG', '600S', 'Telescopic Diesel Boom Lifts'),
    ('JLG 860SJ', 'JLG', '860SJ', 'Telescopic Diesel Boom Lifts'),
    ('JLG 1200SJP', 'JLG', '1200SJP', 'Telescopic Diesel Boom Lifts'),
    ('Genie SX-105 XC', 'Genie', 'SX-105 XC', 'Telescopic Diesel Boom Lifts'),
    ('JLG 450AJ', 'JLG', '450AJ', 'Articulated Diesel Boom Lifts')
) AS eq(name, manufacturer, model_id, category_name)
JOIN categories cat ON cat.name = eq.category_name AND cat.parent_id IS NOT NULL
WHERE NOT EXISTS (SELECT 1 FROM equipment WHERE name = eq.name);

-- Insert rate cards for the equipment
INSERT INTO rate_cards (equipment_id, duration_min, duration_max, daily_rate, is_active)
SELECT 
    e.id,
    rc.duration_min,
    rc.duration_max,
    rc.daily_rate,
    true
FROM equipment e
JOIN (VALUES
    -- Genie GS-1930 rates
    ('GS-1930', 1, 3, 150.00),
    ('GS-1930', 4, 28, 120.00),
    -- Genie GS-2632 rates
    ('GS-2632', 1, 3, 170.00),
    ('GS-2632', 4, 28, 135.00),
    -- Genie GS-3246 rates
    ('GS-3246', 1, 3, 190.00),
    ('GS-3246', 4, 28, 150.00),
    -- JLG 260MRT rates
    ('260MRT', 1, 3, 220.00),
    ('260MRT', 4, 28, 175.00),
    -- Genie Z-45 DC rates
    ('Z-45 DC', 1, 3, 350.00),
    ('Z-45 DC', 4, 28, 280.00),
    -- JLG 600S rates
    ('600S', 1, 3, 550.00),
    ('600S', 4, 28, 440.00),
    -- JLG 860SJ rates
    ('860SJ', 1, 3, 1200.00),
    ('860SJ', 4, 28, 960.00),
    -- JLG 1200SJP rates
    ('1200SJP', 1, 3, 1600.00),
    ('1200SJP', 4, 28, 1280.00),
    -- Genie SX-105 XC rates
    ('SX-105 XC', 1, 3, 1400.00),
    ('SX-105 XC', 4, 28, 1120.00),
    -- JLG 450AJ rates
    ('450AJ', 1, 3, 400.00),
    ('450AJ', 4, 28, 320.00)
) AS rc(model_id, duration_min, duration_max, daily_rate)
ON e.specifications->>'modelId' = rc.model_id
WHERE NOT EXISTS (
    SELECT 1 FROM rate_cards 
    WHERE equipment_id = e.id 
    AND duration_min = rc.duration_min 
    AND duration_max = rc.duration_max
);

-- Insert services
INSERT INTO services (name, description, price, type, is_active) VALUES
('Delivery', 'Equipment delivery to site', 150.00, 'delivery', true),
('Collection', 'Equipment collection from site', 150.00, 'delivery', true),
('Cleaning', 'Equipment cleaning service', 75.00, 'cleaning', true),
('Insurance', 'Equipment damage waiver insurance', 50.00, 'insurance', true)
ON CONFLICT DO NOTHING;

-- Show summary
SELECT 'Categories' as table_name, COUNT(*) as count FROM categories
UNION ALL
SELECT 'Equipment', COUNT(*) FROM equipment
UNION ALL
SELECT 'Rate Cards', COUNT(*) FROM rate_cards
UNION ALL
SELECT 'Services', COUNT(*) FROM services; 