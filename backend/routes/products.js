import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

const CATEGORY_CONFIG = {
  cars: {
    table: 'coin_afrique_cars',
    idColumn: 'coin_afrique_id',
    selectFields: `
      coin_afrique_id AS source_id,
      brand,
      model,
      seller_name,
      location,
      Price AS price,
      image_url,
      year
    `,
    orderBy: 'brand ASC, model ASC',
    mapRow: (row) => {
      const nameParts = [row.brand, row.model].filter(Boolean);
      const name = nameParts.length
        ? nameParts.join(' ').replace(/\s+/g, ' ').trim()
        : 'Vehicle listing';
      const details = [
        row.year && `Year: ${row.year}`,
        row.location && `Location: ${row.location}`,
        row.seller_name && `Seller: ${row.seller_name}`
      ]
        .filter(Boolean)
        .join(' • ');

      return {
        id: String(row.source_id),
        name,
        description: details || 'Vehicle sourced from CoinAfrique listings',
        price: Number(row.price) || 0,
        imageUrl: row.image_url || 'https://via.placeholder.com/600x400?text=Vehicle',
        category: 'cars',
        brand: row.brand || null,
        model: row.model || null,
        color: null,
        storage: null,
        screenSize: null,
        battery: null,
        engine: null,
        range: null,
        acceleration: null,
        location: row.location || null,
        sellerName: row.seller_name || null,
        year: row.year || null
      };
    }
  },
  jumia: {
    table: 'jumia_products',
    idColumn: 'jumia_product_id',
    selectFields: `
      jumia_product_id AS source_id,
      brand_name,
      product_name,
      Price AS price,
      discount,
      reviews_rating,
      reviews_count,
      image_url
    `,
    orderBy: 'brand_name ASC, product_name ASC',
    mapRow: (row) => {
      const name =
        (row.product_name && row.product_name.trim()) ||
        (row.brand_name && row.brand_name.trim()) ||
        'Jumia product';
      const details = [
        row.brand_name && `Brand: ${row.brand_name}`,
        row.discount && `Discount: ${row.discount}`,
        row.reviews_rating && `Rating: ${row.reviews_rating}`,
        row.reviews_count && `${row.reviews_count} reviews`
      ]
        .filter(Boolean)
        .join(' • ');

      return {
        id: String(row.source_id),
        name,
        description: details || 'Popular item sourced from Jumia listings',
        price: Number(row.price) || 0,
        imageUrl: row.image_url || 'https://via.placeholder.com/600x400?text=Product',
        category: 'jumia',
        brand: row.brand_name || null,
        color: null,
        storage: null,
        screenSize: null,
        battery: null,
        engine: null,
        range: null,
        acceleration: null,
        discount: row.discount || null,
        reviewsRating: row.reviews_rating || null,
        reviewsCount: row.reviews_count || null
      };
    }
  }
};

const VALID_CATEGORIES = Object.keys(CATEGORY_CONFIG);

const buildQuery = (config, id) => {
  let query = `SELECT ${config.selectFields} FROM ${config.table}`;
  const params = [];

  if (id) {
    query += ` WHERE ${config.idColumn} = ?`;
    params.push(id);
  } else if (config.orderBy) {
    query += ` ORDER BY ${config.orderBy}`;
  }

  return { query, params };
};

const formatError = () => ({
  error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`
});

// GET all products by category
router.get('/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const config = CATEGORY_CONFIG[category];

    if (!config) {
      return res.status(400).json(formatError());
    }

    const { query, params } = buildQuery(config);
    const [rows] = await pool.query(query, params);

    res.json(rows.map(config.mapRow));
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET single product by category and id
router.get('/:category/:id', async (req, res) => {
  try {
    const { category, id } = req.params;
    const config = CATEGORY_CONFIG[category];

    if (!config) {
      return res.status(400).json(formatError());
    }

    const { query, params } = buildQuery(config, id);
    const [rows] = await pool.query(query, params);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(config.mapRow(rows[0]));
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// GET all products (optional - for admin or general listing)
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;

    if (category) {
      const config = CATEGORY_CONFIG[category];
      if (!config) {
        return res.status(400).json(formatError());
      }

      const { query, params } = buildQuery(config);
      const [rows] = await pool.query(query, params);
      return res.json(rows.map(config.mapRow));
    }

    const results = await Promise.all(
      VALID_CATEGORIES.map(async (cat) => {
        const config = CATEGORY_CONFIG[cat];
        const { query, params } = buildQuery(config);
        const [rows] = await pool.query(query, params);
        return rows.map(config.mapRow);
      })
    );

    res.json(results.flat());
  } catch (error) {
    console.error('Error fetching all products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

export default router;

