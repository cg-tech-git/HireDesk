#!/usr/bin/env ts-node

import { createConnection, DataSource } from 'typeorm';
import { parse } from 'csv-parse/sync';
import * as fs from 'fs';
import * as path from 'path';
import { createLogger } from '../packages/backend/src/config/logger';
import { Category } from '../packages/backend/src/entities/Category';
import { Equipment } from '../packages/backend/src/entities/Equipment';
import { RateCard } from '../packages/backend/src/entities/RateCard';

// Create database connection (using your existing connection from backend)
const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5433', 10), // Changed to 5433 for Cloud SQL proxy
  username: process.env.DATABASE_USER || 'hiredesk_user',
  password: process.env.DATABASE_PASSWORD || 'hiredesk_prod_2024',
  database: process.env.DATABASE_NAME || 'hiredesk_db', // Changed to hiredesk_db
  entities: [Category, Equipment, RateCard],
  synchronize: false,
  logging: false
});

const logger = createLogger('pricing-import');

interface PricingRow {
  Category: string;
  'Sub-category': string;
  'Model Name': string;
  'Model ID': string;
  'Min Days': string;
  'Max Days': string;
  'Rate': string;
  'Period': string;
}

interface EquipmentData {
  modelId: string;
  name: string;
  manufacturer: string;
  category: string;
  subCategory: string;
}

interface PricingData {
  modelId: string;
  minDays: number;
  maxDays: number;
  rate: number;
  period: string;
}

class PricingImporter {
  async import(csvFilePath: string): Promise<void> {
    try {
      await dataSource.initialize();
      logger.info('Database connection established');

      // Read and parse CSV
      const csvContent = fs.readFileSync(csvFilePath, 'utf-8');
      const records: PricingRow[] = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
      });

      logger.info(`Found ${records.length} pricing records in CSV`);

      // Process data
      const { equipmentData, pricingData } = this.processRecords(records);
      
      // Import in transaction
      await dataSource.transaction(async (manager) => {
        await this.importCategories(manager, equipmentData);
        await this.importEquipment(manager, equipmentData);
        await this.importPricing(manager, pricingData);
      });

      logger.info('Import completed successfully');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('Import failed:', errorMessage);
      throw error;
    } finally {
      await dataSource.destroy();
    }
  }

  private processRecords(records: PricingRow[]): { equipmentData: EquipmentData[], pricingData: PricingData[] } {
    const equipmentMap = new Map<string, EquipmentData>();
    const pricingData: PricingData[] = [];

    for (const record of records) {
      const modelId = record['Model ID'];
      
      // Extract equipment data
      if (!equipmentMap.has(modelId)) {
        // Extract manufacturer from model name (e.g., "Genie Z-45 DC" -> "Genie")
        const manufacturer = record['Model Name'].split(' ')[0];
        
        equipmentMap.set(modelId, {
          modelId,
          name: record['Model Name'],
          manufacturer,
          category: record.Category,
          subCategory: record['Sub-category'],
        });
      }

      // Extract pricing data
      const rateStr = record['Rate'].replace(/[",]/g, ''); // Remove commas and quotes
      pricingData.push({
        modelId,
        minDays: parseInt(record['Min Days']),
        maxDays: parseInt(record['Max Days']),
        rate: parseFloat(rateStr),
        period: record['Period'],
      });
    }

    return {
      equipmentData: Array.from(equipmentMap.values()),
      pricingData,
    };
  }

  private async importCategories(manager: any, equipmentData: EquipmentData[]): Promise<void> {
    const categories = new Set<string>();
    const subCategories = new Map<string, string>(); // subcategory -> parent category

    equipmentData.forEach(eq => {
      categories.add(eq.category);
      subCategories.set(eq.subCategory, eq.category);
    });

    // Insert main categories
    for (const categoryName of categories) {
      await manager.query(`
        INSERT INTO categories (name, description, is_active)
        SELECT $1, $2, true
        WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = $3)
      `, [categoryName, `Equipment category: ${categoryName}`, categoryName]);
    }

    // Insert subcategories with parent references
    for (const [subCategoryName, parentCategoryName] of subCategories) {
      await manager.query(`
        INSERT INTO categories (name, description, parent_id, is_active)
        SELECT $1, $2, parent.id, true
        FROM categories parent
        WHERE parent.name = $3 
        AND NOT EXISTS (SELECT 1 FROM categories WHERE name = $4)
      `, [subCategoryName, `Equipment subcategory: ${subCategoryName}`, parentCategoryName, subCategoryName]);
    }

    logger.info(`Imported ${categories.size} categories and ${subCategories.size} subcategories`);
  }

  private async importEquipment(manager: any, equipmentData: EquipmentData[]): Promise<void> {
    let importedCount = 0;

    for (const eq of equipmentData) {
      // First check if equipment exists
      const existing = await manager.query(
        `SELECT id FROM equipment WHERE name = $1`,
        [eq.name]
      );

      if (existing.length === 0) {
        // Insert new equipment
        const result = await manager.query(`
          INSERT INTO equipment (name, category_id, description, specifications, is_active)
          SELECT $1, cat.id, $2, $3, true
          FROM categories cat
          WHERE cat.name = $4 AND cat.parent_id IS NOT NULL
          RETURNING id
        `, [
          eq.name,
          `${eq.manufacturer} ${eq.name} - Professional aerial work platform for construction and industrial applications`,
          JSON.stringify({ manufacturer: eq.manufacturer, modelId: eq.modelId }),
          eq.subCategory
        ]);

        if (result.length > 0) {
          importedCount++;
        }
      } else {
        // Update existing equipment
        await manager.query(`
          UPDATE equipment 
          SET description = $1, 
              specifications = $2,
              updated_at = CURRENT_TIMESTAMP
          WHERE name = $3
        `, [
          `${eq.manufacturer} ${eq.name} - Professional aerial work platform for construction and industrial applications`,
          JSON.stringify({ manufacturer: eq.manufacturer, modelId: eq.modelId }),
          eq.name
        ]);
        importedCount++;
      }
    }

    logger.info(`Imported/updated ${importedCount} equipment records`);
  }

  private async importPricing(manager: any, pricingData: PricingData[]): Promise<void> {
    let importedCount = 0;

    for (const pricing of pricingData) {
      // Get equipment by name (from modelId stored in specifications)
      const eqResult = await manager.query(`
        SELECT id FROM equipment 
        WHERE specifications->>'modelId' = $1
      `, [pricing.modelId]);

      if (eqResult.length > 0) {
        const equipmentId = eqResult[0].id;
        
        // Check if rate card exists
        const existing = await manager.query(`
          SELECT id FROM rate_cards 
          WHERE equipment_id = $1 AND duration_min = $2 AND duration_max = $3
        `, [equipmentId, pricing.minDays, pricing.maxDays]);

        if (existing.length === 0) {
          // Insert new rate card
          await manager.query(`
            INSERT INTO rate_cards (equipment_id, duration_min, duration_max, daily_rate, is_active)
            VALUES ($1, $2, $3, $4, true)
          `, [
            equipmentId,
            pricing.minDays,
            pricing.maxDays,
            pricing.rate
          ]);
          importedCount++;
        } else {
          // Update existing rate card
          await manager.query(`
            UPDATE rate_cards 
            SET daily_rate = $1, updated_at = CURRENT_TIMESTAMP
            WHERE equipment_id = $2 AND duration_min = $3 AND duration_max = $4
          `, [
            pricing.rate,
            equipmentId,
            pricing.minDays,
            pricing.maxDays
          ]);
          importedCount++;
        }
      }
    }

    logger.info(`Imported/updated ${importedCount} pricing records`);
  }


}

// Main execution
async function main() {
  const csvPath = process.argv[2];
  
  if (!csvPath) {
    console.error('Usage: ts-node import-pricing.ts <path-to-csv-file>');
    process.exit(1);
  }

  if (!fs.existsSync(csvPath)) {
    console.error(`CSV file not found: ${csvPath}`);
    process.exit(1);
  }

  const importer = new PricingImporter();
  
  try {
    await importer.import(csvPath);
    console.log('✅ Pricing import completed successfully!');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Pricing import failed:', errorMessage);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { PricingImporter }; 