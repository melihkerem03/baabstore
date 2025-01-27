import initSqlJs from 'sql.js';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, 'store.db');

let db: any;

const initDb = async () => {
  const SQL = await initSqlJs();
  
  let buffer;
  if (existsSync(dbPath)) {
    buffer = readFileSync(dbPath);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
    
    // Create tables
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE,
        password TEXT,
        name TEXT,
        isAdmin INTEGER DEFAULT 0,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT,
        description TEXT,
        price REAL,
        image TEXT,
        stock INTEGER,
        category TEXT,
        subcategory TEXT,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT UNIQUE,
        subcategories TEXT,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS home_sections (
        id TEXT PRIMARY KEY,
        title TEXT,
        subtitle TEXT,
        image TEXT,
        category TEXT,
        buttonText TEXT,
        targetSubcategory TEXT,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Save the database
    const data = db.export();
    writeFileSync(dbPath, Buffer.from(data));
  }

  // Save database on process exit
  process.on('exit', () => {
    if (db) {
      const data = db.export();
      writeFileSync(dbPath, Buffer.from(data));
    }
  });

  // Handle interrupts
  process.on('SIGINT', () => {
    process.exit();
  });
};

await initDb();

export default db;