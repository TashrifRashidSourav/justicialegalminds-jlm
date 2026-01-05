import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Parse DATABASE_URL
const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
    console.error('❌ DATABASE_URL is missing in .env');
    // We don't throw here to allow app to start and show error page if needed, 
    // but without DB it will eventually fail. 
    // Better to fail fast for cPanel logging.
    throw new Error('DATABASE_URL is missing in .env');
}

// Create connection pool directly from URL string - significantly more robust than regex
const pool = mysql.createPool(dbUrl);

// Test connection
pool.getConnection()
    .then(connection => {
        console.log('✅ Database connected successfully');
        connection.release();
    })
    .catch(err => {
        console.error('❌ Database connection failed:', err.message);
    });

export default pool;
