import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productsRouter from './routes/products.js';
import categoriesRouter from './routes/categories.js';
import homeSectionsRouter from './routes/homeSections.js';
import authRouter from './routes/auth.js';
import './db/init.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/home-sections', homeSectionsRouter);
app.use('/api/auth', authRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});