import fs from 'fs';
import path from 'path';
import { createPool } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function importLocations() {
  const filePath = path.join(__dirname, '../src/data/locations.json');
  const rawData = fs.readFileSync(filePath, 'utf-8');
  const locations = JSON.parse(rawData);
  try {
    for (const location of locations) {
      const { city, airport, iata } = location;
      await pool.query(
        'INSERT INTO locations (city, airport, iata) VALUES (?, ?, ?)',
        [city, airport, iata]
      );
    }
    console.log('Locations imported successfully');
  } catch (error) {
    console.error('Error importing locations:', error);
  } finally {
    await pool.end();
  }
}

importLocations();
