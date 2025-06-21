import { Router } from 'express';
import { QuoteController } from '../controllers/quote.controller';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../types/local-shared';

const router = Router();

// Customer routes
router.post('/calculate', authenticate, QuoteController.calculate);
router.post('/', authenticate, QuoteController.create);
router.get('/my-quotes', authenticate, QuoteController.getUserQuotes);
router.get('/:id', authenticate, QuoteController.getById);
router.put('/:id', authenticate, QuoteController.update);
router.post('/:id/submit', authenticate, QuoteController.submit);

// Admin/Hire Desk routes
router.get('/', authenticate, authorize(UserRole.HIRE_DESK, UserRole.ADMIN), QuoteController.getAllQuotes);

export default router; 