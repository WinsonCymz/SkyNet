

import { pool } from '../../backend/db.ts';

export interface Flight {
  id: number;
  airline_name: string;
  departure_iata: string;
  departure_time: Date;
  arrival_iata: string;
  arrival_time: Date;
  price: number;
}

export const fetchFlightsFromDB = async (): Promise<Flight[]> => {
  try {
    const [rows] = await pool.query('SELECT * FROM flights');
    return rows as Flight[];
  } catch (error) {
    console.error('Error fetching flights from DB:', error);
    return [];
  }
};