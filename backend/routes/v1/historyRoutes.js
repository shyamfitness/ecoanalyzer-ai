import { Router } from 'express';
import {
  getHistory,
  getHistorySummary,
  exportHistoryCsv,
  deleteAnalysis,
} from '../../controllers/historyController.js';
import { authenticateToken } from '../../middleware/auth.js';

const router = Router();

router.get('/', authenticateToken, getHistory);
router.get('/summary', authenticateToken, getHistorySummary);
router.get('/export', authenticateToken, exportHistoryCsv);
router.delete('/:id', authenticateToken, deleteAnalysis);

export default router;

