import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import db from '../db/init.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuidv4();
    const isAdmin = email === 'admin@example.com'; // For demo purposes
    
    const stmt = db.prepare(`
      INSERT INTO users (id, email, password, name, isAdmin)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    stmt.run(id, email, hashedPassword, name, isAdmin ? 1 : 0);
    
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    
    const token = jwt.sign(
      { id: user.id, isAdmin: Boolean(user.isAdmin) },
      process.env.JWT_SECRET
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: Boolean(user.isAdmin)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error registering user' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, isAdmin: Boolean(user.isAdmin) },
      process.env.JWT_SECRET
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: Boolean(user.isAdmin)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
});

export default router;