import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../db/init.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all home sections
router.get('/', (req, res) => {
  try {
    const sections = db.prepare('SELECT * FROM home_sections').all();
    res.json(sections);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching home sections' });
  }
});

// Update home section (admin only)
router.put('/:id', authenticateToken, isAdmin, (req, res) => {
  try {
    const { title, subtitle, image, category, buttonText, targetSubcategory } = req.body;
    
    const stmt = db.prepare(`
      UPDATE home_sections 
      SET title = ?, subtitle = ?, image = ?, category = ?, 
          buttonText = ?, targetSubcategory = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    stmt.run(title, subtitle, image, category, buttonText, targetSubcategory, req.params.id);
    
    const section = db.prepare('SELECT * FROM home_sections WHERE id = ?').get(req.params.id);
    res.json(section);
  } catch (error) {
    res.status(500).json({ error: 'Error updating home section' });
  }
});

export default router;