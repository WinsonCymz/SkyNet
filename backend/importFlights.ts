import fs from 'fs';
import path from 'path';
import { pool } from './db';

interface Flight {
  airline: { name: string };
  departure: { iata: string; scheduled: string };
  arrival: { iata: string; scheduled: string };
}

async function importFlights() {
  const filePath = path.join(__dirname, '../src/data/flights.json');
  const rawData = fs.readFileSync(filePath, 'utf-8');
  const flights: Flight[] = JSON.parse(rawData);

  for (const flight of flights) {
    const { name } = flight.airline;
    const { iata: departureIATA, scheduled: departureTime } = flight.departure;
    const { iata: arrivalIATA, scheduled: arrivalTime } = flight.arrival;

    try {
      await pool.query(
        'INSERT INTO flights (airline_name, departure_iata, departure_time, arrival_iata, arrival_time) VALUES (?, ?, ?, ?, ?)',
        [name, departureIATA, departureTime, arrivalIATA, arrivalTime]
      );
    } catch (err) {
      console.error('Failed to insert flight:', flight, '\nError:', err);
    }
  }

  console.log('✅ Flights imported.');
  process.exit(0);
}

importFlights();