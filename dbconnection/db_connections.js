import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();
export const db=mysql.createPool({
    connectionLimit:10,
    host:process.env.DB_HOST,
    port:process.env.DB_PORT,
    database:process.env.DB_NAME,
    password:process.env.DB_PASS,
    user:process.env.DB_ROOT
})