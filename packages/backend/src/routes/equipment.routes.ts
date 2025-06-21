import { Router } from 'express';
import { EquipmentController } from '../controllers/equipment.controller';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../types/local-shared';

const router = Router();

// Public routes (no authentication required)
router.get('/test', EquipmentController.testDb);
router.get('/test-all', async (req, res) => {
  try {
    const { AppDataSource } = await import('../config/database');
    // First check table structure
    const columns = await AppDataSource.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'equipment'
    `);
    
    // Then get some equipment data
    const result = await AppDataSource.query('SELECT * FROM equipment LIMIT 5');
    
    res.json({
      success: true,
      columns: columns,
      data: result,
      total: result.length
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
router.get('/test-search', async (req, res) => {
  try {
    const { AppDataSource } = await import('../config/database');
    const { name } = req.query;
    
    let query = 'SELECT id, name, model_id, is_active FROM equipment';
    const params: any[] = [];
    
    if (name) {
      query += ' WHERE name ILIKE $1';
      params.push(`%${name}%`);
    }
    
    query += ' ORDER BY name';
    
    const result = await AppDataSource.query(query, params);
    
    res.json({
      success: true,
      searchTerm: name || 'all',
      count: result.length,
      data: result
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
router.get('/ping', EquipmentController.ping);

// Public equipment routes (no authentication required for viewing)
router.get('/', EquipmentController.getAll);
router.get('/:id', EquipmentController.getById);
router.get('/:id/rate-cards', EquipmentController.getRateCards);
router.get('/:id/calculate-price', EquipmentController.calculatePrice);

// Protected routes
router.use(authenticate);

// Test routes without auth for development
router.get('/test', EquipmentController.getAll);
router.get('/test-db', EquipmentController.testDb);
router.get('/test-rates/:id', EquipmentController.getRateCards);
router.get('/test-price/:id', EquipmentController.calculatePrice);

// Admin routes
router.post('/', authorize(UserRole.ADMIN), EquipmentController.create);
router.put('/:id', authorize(UserRole.ADMIN), EquipmentController.update);
router.delete('/:id', authorize(UserRole.ADMIN), EquipmentController.delete);

export default router; 