import { Router } from 'express';
import authRoutes from '../../routes/auth.js';
import userRoutes from '../../routes/users.js';
import analyzeRoutes from './analyzeRoutes.js';
import historyRoutes from './historyRoutes.js';
import barcodeRoutes from './barcodeRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/analyze', analyzeRoutes);
router.use('/history', historyRoutes);
router.use('/barcode', barcodeRoutes);

export default router;

