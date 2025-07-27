const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/.env' });
console.log("Loaded env variables:", process.env.DB_HOST);

const express = require('express');
const cors = require('cors');
const { pool } = require('./db');

const app = express();
// Configure CORS to allow only specific origins
const allowedOrigins = [
  "http://localhost:3000",
  "http://skynet-frontend-bucket.s3-website-us-east-1.amazonaws.com"
];
app.use(cors({
  origin: (
    incomingOrigin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    if (!incomingOrigin || allowedOrigins.includes(incomingOrigin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
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

app.post('/api/bookings', async (req: Request, res: Response) => {
  try {
    const {
      flight_info,
      from_location,
      to_location,
      depart_date,
      return_date,
      trip_type,
      adults,
      children,
      cabin_class,
      contact_first_name,
      contact_last_name,
      contact_phone,
      contact_email,
      passengers,
      base_price,
      extras_price,
      baggage_price,
      total_price,
      payment_method,
      card_holder_name,
      card_last4,
      card_expiry,
      billing_address,
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO booking_details
        (flight_info, from_location, to_location, depart_date, return_date,
         trip_type, adults, children, cabin_class,
         contact_first_name, contact_last_name, contact_phone, contact_email,
         passengers, base_price, extras_price, baggage_price, total_price,
         payment_method, card_holder_name, card_last4, card_expiry, billing_address)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        JSON.stringify(flight_info),
        from_location,
        to_location,
        new Date(depart_date),
        return_date ? new Date(return_date) : null,
        trip_type,
        adults,
        children,
        cabin_class,
        contact_first_name,
        contact_last_name,
        contact_phone,
        contact_email,
        JSON.stringify(passengers),
        parseFloat(base_price),
        parseFloat(extras_price),
        parseFloat(baggage_price),
        parseFloat(total_price),
        payment_method,
        card_holder_name,
        card_last4,
        card_expiry,
        billing_address,
      ]
    );
    res.status(201).json({ bookingId: (result as any).insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not save booking' });
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