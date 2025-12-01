import sharp from 'sharp';
import { createWorker } from 'tesseract.js';

let workerInstance;

const getWorker = async () => {
  if (!workerInstance) {
    workerInstance = await createWorker();
    await workerInstance.loadLanguage('eng');
    await workerInstance.initialize('eng');
  }
  return workerInstance;
};

export const ocrService = {
  async extractText(buffer) {
    if (!buffer) {
      return { text: '', confidence: 0 };
    }

    try {
      const processedImage = await sharp(buffer)
        .resize(1400, 1400, { fit: 'inside', withoutEnlargement: true })
        .sharpen()
        .normalize()
        .toFormat('png')
        .toBuffer();

      const worker = await getWorker();
      const { data } = await worker.recognize(processedImage);

      return {
        text: (data.text || '').trim(),
        confidence: (data.confidence || 0) / 100,
      };
    } catch (error) {
      console.warn('OCR extraction failed:', error.message);
      return {
        text: '',
        confidence: 0,
        error: error.message,
      };
    }
  },
};

