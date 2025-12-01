import { Router } from 'express';
import { lookupBarcode } from '../../controllers/barcodeController.js';
import { authenticateToken } from '../../middleware/auth.js';

const router = Router();

router.get('/lookup/:barcode', authenticateToken, lookupBarcode);
router.get('/lookup', authenticateToken, lookupBarcode);

export default router;