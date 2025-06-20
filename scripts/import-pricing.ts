#!/usr/bin/env ts-node

import { createConnection, DataSource } from 'typeorm';
import { parse } from 'csv-parse/sync';
import * as fs from 'fs';
import * as path from 'path';
import { createLogger } from '../packages/backend/src/config/logger';

// Database configuration
const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'hiredesk',
  synchronize: false,
  logging: false,
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
  private logId: string = '';

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

      // Start import log
      this.logId = await this.createImportLog(path.basename(csvFilePath), records.length);

      // Process data
      const { equipmentData, pricingData } = this.processRecords(records);
      
      // Import in transaction
      await dataSource.transaction(async (manager) => {
        await this.importCategories(manager, equipmentData);
        await this.importEquipment(manager, equipmentData);
        await this.importPricing(manager, pricingData);
      });

      await this.updateImportLog('completed', records.length, 0);
      logger.info('Import completed successfully');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('Import failed:', errorMessage);
      if (this.logId) {
        await this.updateImportLog('failed', 0, 0, { error: errorMessage });
      }
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
      const result = await manager.query(`
        INSERT INTO equipment (model_id, name, manufacturer, category_id, description, is_active)
        SELECT $1, $2, $3, cat.id, $4, true
        FROM categories cat
        WHERE cat.name = $5 AND cat.parent_id IS NOT NULL
        ON CONFLICT (model_id) 
        DO UPDATE SET 
          name = EXCLUDED.name,
          manufacturer = EXCLUDED.manufacturer,
          description = EXCLUDED.description,
          updated_at = CURRENT_TIMESTAMP
        RETURNING id
      `, [
        eq.modelId,
        eq.name,
        eq.manufacturer,
        `${eq.manufacturer} ${eq.name} - Professional aerial work platform for construction and industrial applications`,
        eq.subCategory
      ]);

      if (result.length > 0) {
        importedCount++;
      }
    }

    logger.info(`Imported/updated ${importedCount} equipment records`);
  }

  private async importPricing(manager: any, pricingData: PricingData[]): Promise<void> {
    let importedCount = 0;

    for (const pricing of pricingData) {
      // Insert into equipment_pricing table
      const result = await manager.query(`
        INSERT INTO equipment_pricing (equipment_id, pricing_tier_id, daily_rate, effective_date, is_active)
        SELECT 
          eq.id,
          pt.id,
          $1,
          CURRENT_DATE,
          true
        FROM equipment eq
        JOIN pricing_tiers pt ON pt.duration_min = $2 AND pt.duration_max = $3
        WHERE eq.model_id = $4
        ON CONFLICT (equipment_id, pricing_tier_id, effective_date)
        DO UPDATE SET 
          daily_rate = EXCLUDED.daily_rate,
          updated_at = CURRENT_TIMESTAMP
        RETURNING id
      `, [
        pricing.rate,
        pricing.minDays,
        pricing.maxDays,
        pricing.modelId
      ]);

      // Also insert into legacy rate_cards table for compatibility
      await manager.query(`
        INSERT INTO rate_cards (equipment_id, duration_min, duration_max, daily_rate, period, is_active)
        SELECT eq.id, $1, $2, $3, $4, true
        FROM equipment eq
        WHERE eq.model_id = $5
        ON CONFLICT (equipment_id, duration_min, duration_max)
        DO UPDATE SET 
          daily_rate = EXCLUDED.daily_rate,
          period = EXCLUDED.period,
          updated_at = CURRENT_TIMESTAMP
      `, [
        pricing.minDays,
        pricing.maxDays,
        pricing.rate,
        pricing.period,
        pricing.modelId
      ]);

      if (result.length > 0) {
        importedCount++;
      }
    }

    logger.info(`Imported/updated ${importedCount} pricing records`);
  }

  private async createImportLog(filename: string, totalRows: number): Promise<string> {
    const result = await dataSource.query(`
      INSERT INTO pricing_import_logs (filename, total_rows, processed_rows, error_rows, status)
      VALUES ($1, $2, 0, 0, 'processing')
      RETURNING id
    `, [filename, totalRows]);
    
    return result[0].id;
  }

  private async updateImportLog(
    status: string, 
    processedRows: number, 
    errorRows: number, 
    errorDetails?: any
  ): Promise<void> {
    await dataSource.query(`
      UPDATE pricing_import_logs 
      SET status = $1, processed_rows = $2, error_rows = $3, error_details = $4, updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
    `, [status, processedRows, errorRows, errorDetails ? JSON.stringify(errorDetails) : null, this.logId]);
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