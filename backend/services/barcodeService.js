import axios from 'axios';

const OPEN_FOOD_FACTS_URL = 'https://world.openfoodfacts.org/api/v0/product';

export const barcodeService = {
  async lookup(barcode) {
    if (!barcode) {
      throw new Error('Barcode is required');
    }

    const apiUrl = process.env.BARCODE_LOOKUP_URL;
    const apiKey = process.env.BARCODE_LOOKUP_KEY;

    try {
      if (apiUrl && apiKey) {
        const { data } = await axios.get(apiUrl, {
          params: {
            barcode,
            key: apiKey,
          },
        });

        if (data && data.product) {
          return this.transformProduct(data.product);
        }
      }

      const { data } = await axios.get(`${OPEN_FOOD_FACTS_URL}/${barcode}.json`);
      if (data?.status === 1) {
        return this.transformProduct(data.product);
      }

      return null;
    } catch (error) {
      console.warn('Barcode lookup failed:', error.message);
      return null;
    }
  },

  transformProduct(product = {}) {
    return {
      name: product.product_name || product.brands_tags?.[0] || 'Unknown product',
      brand: product.brands || null,
      barcode: product.code,
      description: product.generic_name || product.ingredients_text || '',
      origin: product.countries_exported_to || product.countries || 'Unknown',
      category: product.categories_tags?.[0]?.replace('en:', '') || 'Other',
      imageUrl: product.image_url || null,
      ingredients: product.ingredients?.map((ing) => ing.text).filter(Boolean) || [],
      materials: product.materials?.map((material) => material.name) || [],
      packaging: product.packaging,
      environmental_data: product.ecoscore_data || null,
    };
  },
};

