const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/.env' });
console.log("Loaded env variables:", process.env.DB_HOST);

const express = require('express');
const cors = require('cors');
const { pool } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

import { Request, Response } from 'express';
app.get('/', (req: Request, res: Response) => {
  res.send('API is alive!');
});
app.get('/api/flights', async (req: Request, res: Response) => {  
  
  try {
    const [rows] = await pool.query(
      'SELECT airline_name, departure_iata, arrival_iata, departure_time, arrival_time FROM flights'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching flights');
  }
});

app.get('/api/locations', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(
      'SELECT city, airport, iata FROM locations'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching locations');
  }
});

const PORT = process.env.PORT || 4000;


pool.getConnection()
  .then((conn: { release: () => void; }) => {
    console.log('✅ Database connected successfully');
    conn.release();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err: any) => {
    console.error('❌ Failed to connect to database:', err);
    process.exit(1); // prevent app from running with broken DB
  });