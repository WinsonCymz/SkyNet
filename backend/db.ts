import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: 'skynet-rds.c8dar0yf2xwy.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: 'password',
  database: 'skynet',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});