-- HireDesk Pricing Schema Extension
-- Extends the main database with pricing management tables

-- Add model_id column to equipment table for CSV mapping
ALTER TABLE equipment ADD COLUMN IF NOT EXISTS model_id VARCHAR(100) UNIQUE;
ALTER TABLE equipment ADD COLUMN IF NOT EXISTS manufacturer VARCHAR(100);

-- Create index for model_id lookups
CREATE INDEX IF NOT EXISTS idx_equipment_model_id ON equipment(model_id);

-- Pricing tiers table for standardized pricing buckets
CREATE TABLE IF NOT EXISTS pricing_tiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    duration_min INTEGER NOT NULL CHECK (duration_min >= 1),
    duration_max INTEGER NOT NULL CHECK (duration_max >= duration_min),
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(duration_min, duration_max)
);

-- Equipment pricing table (extends rate_cards with more metadata)
CREATE TABLE IF NOT EXISTS equipment_pricing (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    equipment_id UUID NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
    pricing_tier_id UUID NOT NULL REFERENCES pricing_tiers(id) ON DELETE CASCADE,
    daily_rate DECIMAL(10, 2) NOT NULL CHECK (daily_rate > 0),
    effective_date DATE NOT NULL DEFAULT CURRENT_DATE,
    expiry_date DATE,
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(equipment_id, pricing_tier_id, effective_date)
);

-- Pricing import logs for tracking CSV imports
CREATE TABLE IF NOT EXISTS pricing_import_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filename VARCHAR(255) NOT NULL,
    total_rows INTEGER NOT NULL,
    processed_rows INTEGER NOT NULL,
    error_rows INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'processing',
    error_details JSONB,
    imported_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_equipment_pricing_equipment ON equipment_pricing(equipment_id);
CREATE INDEX IF NOT EXISTS idx_equipment_pricing_tier ON equipment_pricing(pricing_tier_id);
CREATE INDEX IF NOT EXISTS idx_equipment_pricing_active ON equipment_pricing(is_active);
CREATE INDEX IF NOT EXISTS idx_equipment_pricing_dates ON equipment_pricing(effective_date, expiry_date);
CREATE INDEX IF NOT EXISTS idx_pricing_import_logs_status ON pricing_import_logs(status);

-- Apply updated_at triggers to new tables
CREATE TRIGGER update_pricing_tiers_updated_at BEFORE UPDATE ON pricing_tiers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_equipment_pricing_updated_at BEFORE UPDATE ON equipment_pricing
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pricing_import_logs_updated_at BEFORE UPDATE ON pricing_import_logs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert standard pricing tiers
INSERT INTO pricing_tiers (name, duration_min, duration_max, description, display_order) 
VALUES 
    ('Short-term (1-7 days)', 1, 7, 'Premium rates for short-term rentals', 1),
    ('Medium-term (8-14 days)', 8, 14, 'Standard rates for medium-term rentals', 2),
    ('Long-term (15+ days)', 15, 999, 'Discounted rates for long-term rentals', 3)
ON CONFLICT (duration_min, duration_max) DO NOTHING; 