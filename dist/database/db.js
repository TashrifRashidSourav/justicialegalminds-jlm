"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
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
const pool = promise_1.default.createPool(dbUrl);
// Test connection
pool.getConnection()
    .then(connection => {
    console.log('✅ Database connected successfully');
    connection.release();
})
    .catch(err => {
    console.error('❌ Database connection failed:', err.message);
});
exports.default = pool;
