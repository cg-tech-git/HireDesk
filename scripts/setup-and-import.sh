#!/bin/bash

# HireDesk Database Setup and Pricing Import Script
# This script sets up the database schema and imports pricing data

set -e  # Exit on any error

echo "🚀 Starting HireDesk database setup and pricing import..."

# Check if CSV file is provided
if [ $# -eq 0 ]; then
    echo "❌ Error: Please provide the path to the CSV file"
    echo "Usage: $0 <path-to-csv-file>"
    echo "Example: $0 ../pricing_data/HireDesk_Master_Pricing\ -\ Sheet1.csv"
    exit 1
fi

CSV_FILE="$1"

# Check if CSV file exists
if [ ! -f "$CSV_FILE" ]; then
    echo "❌ Error: CSV file not found: $CSV_FILE"
    exit 1
fi

# Set default database connection parameters if not provided
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_USERNAME=${DB_USERNAME:-postgres}
DB_NAME=${DB_NAME:-hiredesk}

echo "📊 Database connection settings:"
echo "  Host: $DB_HOST"
echo "  Port: $DB_PORT"
echo "  Database: $DB_NAME"
echo "  Username: $DB_USERNAME"
echo ""

# Test database connection
echo "🔍 Testing database connection..."
if ! PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME" -d "$DB_NAME" -c "SELECT 1;" > /dev/null 2>&1; then
    echo "❌ Error: Cannot connect to database. Please check your connection parameters and ensure PostgreSQL is running."
    echo "Set these environment variables:"
    echo "  export DB_PASSWORD=your_password"
    echo "  export DB_HOST=localhost (optional)"
    echo "  export DB_PORT=5432 (optional)"
    echo "  export DB_USERNAME=postgres (optional)"
    echo "  export DB_NAME=hiredesk (optional)"
    exit 1
fi
echo "✅ Database connection successful"

# Step 1: Initialize main database schema
echo ""
echo "🗄️  Step 1: Setting up main database schema..."
if PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME" -d "$DB_NAME" -f init-db.sql > /dev/null 2>&1; then
    echo "✅ Main schema setup completed"
else
    echo "❌ Error: Failed to set up main database schema"
    exit 1
fi

# Step 2: Add pricing schema extensions
echo ""
echo "💰 Step 2: Adding pricing schema extensions..."
if PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME" -d "$DB_NAME" -f pricing-schema.sql > /dev/null 2>&1; then
    echo "✅ Pricing schema extensions added"
else
    echo "❌ Error: Failed to add pricing schema extensions"
    exit 1
fi

# Step 3: Install npm dependencies
echo ""
echo "📦 Step 3: Installing dependencies..."
if npm install > /dev/null 2>&1; then
    echo "✅ Dependencies installed"
else
    echo "❌ Error: Failed to install dependencies"
    exit 1
fi

# Step 4: Import pricing data
echo ""
echo "📈 Step 4: Importing pricing data from CSV..."
echo "  File: $CSV_FILE"

if npx ts-node import-pricing.ts "$CSV_FILE"; then
    echo ""
    echo "🎉 Import completed successfully!"
    
    # Show summary
    echo ""
    echo "📋 Import Summary:"
    PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME" -d "$DB_NAME" -c "
        SELECT 
            (SELECT COUNT(*) FROM categories WHERE parent_id IS NULL) as main_categories,
            (SELECT COUNT(*) FROM categories WHERE parent_id IS NOT NULL) as subcategories,
            (SELECT COUNT(*) FROM equipment) as equipment_count,
            (SELECT COUNT(*) FROM equipment_pricing) as pricing_records;
    " -t | while read line; do
        echo "  $line"
    done
    
else
    echo "❌ Error: Failed to import pricing data"
    exit 1
fi

echo ""
echo "✨ All steps completed successfully!"
echo ""
echo "💡 Next steps:"
echo "  - Verify data in your database"
echo "  - Check import logs: SELECT * FROM pricing_import_logs;"
echo "  - Review equipment: SELECT name, manufacturer FROM equipment LIMIT 10;"
echo ""
echo "🔧 To verify the import, run:"
echo "  psql -h $DB_HOST -p $DB_PORT -U $DB_USERNAME -d $DB_NAME" 