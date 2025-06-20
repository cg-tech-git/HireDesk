# HireDesk Database Scripts

This directory contains database management and import scripts for the HireDesk application.

## Setup

### Prerequisites
- PostgreSQL database running
- Node.js and npm installed
- Environment variables configured

### Database Initialization

1. **Run the main database schema:**
   ```bash
   psql -h localhost -U postgres -d hiredesk -f init-db.sql
   ```

2. **Add pricing schema extensions:**
   ```bash
   psql -h localhost -U postgres -d hiredesk -f pricing-schema.sql
   ```

3. **Or run both with the convenience script:**
   ```bash
   npm run setup-db
   ```

## Pricing Data Import

### Import CSV Pricing Data

The import script will:
- Create equipment categories and subcategories
- Import equipment records with model IDs
- Import pricing data with 3-tier structure (1-7, 8-14, 15+ days)
- Log the import process for tracking

**Usage:**
```bash
# Install dependencies first
npm install

# Run the import
npm run import-pricing "../pricing_data/HireDesk_Master_Pricing - Sheet1.csv"

# Or use ts-node directly
ts-node import-pricing.ts "../pricing_data/HireDesk_Master_Pricing - Sheet1.csv"
```

### Environment Variables

Make sure these are set in your environment:

```bash
export DB_HOST=localhost
export DB_PORT=5432
export DB_USERNAME=postgres
export DB_PASSWORD=your_password
export DB_NAME=hiredesk
```

## Database Schema Overview

### New Tables Added

- **pricing_tiers**: Standardized pricing buckets (1-7, 8-14, 15+ days)
- **equipment_pricing**: Links equipment to pricing tiers with rates
- **pricing_import_logs**: Tracks import operations
- **equipment**: Extended with model_id and manufacturer columns

### CSV Structure Expected

```csv
Category,Sub-category,Model Name,Model ID,Min Days,Max Days,Rate Per Day
Aerial Work Platforms,Articulated Diesel Boom Lifts,Genie Z-45/25J RT,genie-z-45/25j-rt,1,7,"1,200.00"
```

## Verification

After import, you can verify the data:

```sql
-- Check categories
SELECT * FROM categories WHERE parent_id IS NULL;

-- Check equipment count
SELECT COUNT(*) FROM equipment;

-- Check pricing records
SELECT 
    e.name, 
    pt.name as pricing_tier, 
    ep.daily_rate 
FROM equipment_pricing ep
JOIN equipment e ON e.id = ep.equipment_id
JOIN pricing_tiers pt ON pt.id = ep.pricing_tier_id
LIMIT 10;

-- Check import logs
SELECT * FROM pricing_import_logs ORDER BY created_at DESC;
```

## Troubleshooting

- **Permission denied**: Ensure PostgreSQL user has CREATE privileges
- **Module not found**: Run `npm install` in the scripts directory
- **Connection refused**: Verify PostgreSQL is running and environment variables are correct
- **CSV format errors**: Ensure CSV follows exact column naming and format

## Future Enhancements

This foundation supports:
- Dynamic pricing via API
- Admin interface for price management
- Automated sync with external pricing sources
- Historical pricing tracking 