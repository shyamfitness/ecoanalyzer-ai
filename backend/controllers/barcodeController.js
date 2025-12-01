import { z } from 'zod';
import { barcodeService } from '../services/barcodeService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const lookupSchema = z.object({
  barcode: z.string().min(6, 'Barcode must be at least 6 characters'),
});

export const lookupBarcode = asyncHandler(async (req, res) => {
  const input = lookupSchema.safeParse({
    barcode: req.params.barcode || req.query.barcode || req.body?.barcode,
  });

  if (!input.success) {
    return res.status(400).json({ success: false, error: input.error.errors[0].message });
  }

  const product = await barcodeService.lookup(input.data.barcode);
  if (!product) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }

  res.json({ success: true, product });
});

