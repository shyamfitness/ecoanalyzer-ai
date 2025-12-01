import { Router } from 'express';
import multer from 'multer';
import {
  analyzeText,
  analyzeImage,
  analyzeBarcode,
  getAnalysis,
  downloadAnalysisPdf,
} from '../../controllers/analysisController.js';
import { authenticateToken, optionalAuth } from '../../middleware/auth.js';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 12 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image uploads are supported'));
    }
  },
});

router.post('/text', optionalAuth, analyzeText);
router.post('/image', optionalAuth, upload.single('image'), analyzeImage);
router.post('/barcode', optionalAuth, analyzeBarcode);

router.get('/:id', authenticateToken, getAnalysis);
router.get('/:id/pdf', authenticateToken, downloadAnalysisPdf);

export default router;

