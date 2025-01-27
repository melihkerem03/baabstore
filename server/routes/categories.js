import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../db/init.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all categories
router.get('/', (req, res) => {
  try {
    const categories = db.prepare('SELECT * FROM categories').all();
    res.json(categories.map(cat => ({
      ...cat,
      subcategories: JSON.parse(cat.subcategories)
    })));
  } catch (error) {
    res.status(500).json({ error: 'Error fetching categories' });
  }
});

// Create category (admin only)
router.post('/', authenticateToken, isAdmin, (req, res) => {
  try {
    const id = uuidv4();
    const { name, subcategories } = req.body;
    
    const stmt = db.prepare(`
      INSERT INTO categories (id, name, subcategories)
      VALUES (?, ?, ?)
    `);
    
    stmt.run(id, name, JSON.stringify(subcategories));
    
    const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
    res.status(201).json({
      ...category,
      subcategories: JSON.parse(category.subcategories)
    });
  } catch (error) {
    res.status(500).json({ error: 'Error creating category' });
  }
});

// Update category (admin only)
router.put('/:id', authenticateToken, isAdmin, (req, res) => {
  try {
    const { name, subcategories } = req.body;
    
    const stmt = db.prepare(`
      UPDATE categories 
      SET name = ?, subcategories = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    stmt.run(name, JSON.stringify(subcategories), req.params.id);
    
    const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id);
    res.json({
      ...category,
      subcategories: JSON.parse(category.subcategories)
    });
  } catch (error) {
    res.status(500).json({ error: 'Error updating category' });
  }
});

// Delete category (admin only)
router.delete('/:id', authenticateToken, isAdmin, (req, res) => {
  try {
    db.prepare('DELETE FROM categories WHERE id = ?').run(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting category' });
  }
});

export default router;