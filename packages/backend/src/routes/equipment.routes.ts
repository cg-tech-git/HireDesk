import { Router } from 'express';
import { EquipmentController } from '../controllers/equipment.controller';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '@hiredesk/shared';

const router = Router();

// Test routes without auth for development
router.get('/ping', EquipmentController.ping);
router.get('/test', EquipmentController.getAll);
router.get('/test-db', EquipmentController.testDb);
router.get('/test-rates/:id', EquipmentController.getRateCards);
router.get('/test-price/:id', EquipmentController.calculatePrice);

// Public routes (authenticated users can view equipment)
router.get('/', authenticate, EquipmentController.getAll);
router.get('/:id', authenticate, EquipmentController.getById);
router.get('/:id/rate-cards', authenticate, EquipmentController.getRateCards);
router.get('/:id/calculate-price', authenticate, EquipmentController.calculatePrice);

// Admin routes
router.post('/', authenticate, authorize(UserRole.ADMIN), EquipmentController.create);
router.put('/:id', authenticate, authorize(UserRole.ADMIN), EquipmentController.update);
router.delete('/:id', authenticate, authorize(UserRole.ADMIN), EquipmentController.delete);

export default router; 