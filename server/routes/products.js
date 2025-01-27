import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../db/init.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all products
router.get('/', (req, res) => {
  try {
    const products = db.prepare('SELECT * FROM products').all();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching products' });
  }
});

// Create product (admin only)
router.post('/', authenticateToken, isAdmin, (req, res) => {
  try {
    const id = uuidv4();
    const { name, description, price, image, stock, category, subcategory } = req.body;
    
    const stmt = db.prepare(`
      INSERT INTO products (id, name, description, price, image, stock, category, subcategory)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(id, name, description, price, image, stock, category, subcategory);
    
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error creating product' });
  }
});

// Update product (admin only)
router.put('/:id', authenticateToken, isAdmin, (req, res) => {
  try {
    const { name, description, price, image, stock, category, subcategory } = req.body;
    
    const stmt = db.prepare(`
      UPDATE products 
      SET name = ?, description = ?, price = ?, image = ?, stock = ?, 
          category = ?, subcategory = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    stmt.run(name, description, price, image, stock, category, subcategory, req.params.id);
    
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error updating product' });
  }
});

// Delete product (admin only)
router.delete('/:id', authenticateToken, isAdmin, (req, res) => {
  try {
    db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting product' });
  }
});

export default router;