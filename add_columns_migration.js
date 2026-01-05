
const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrate() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('Connected to database.');

        const queries = [
            "ALTER TABLE team_members ADD COLUMN email VARCHAR(255) NULL;",
            "ALTER TABLE team_members ADD COLUMN phone VARCHAR(255) NULL;",
            "ALTER TABLE team_members ADD COLUMN practice_areas TEXT NULL;"
        ];

        for (const query of queries) {
            try {
                await connection.execute(query);
                console.log(`Executed: ${query}`);
            } catch (err) {
                if (err.code === 'ER_DUP_FIELDNAME') {
                    console.log(`Column likely exists already: ${err.message}`);
                } else {
                    throw err;
                }
            }
        }

        console.log('Migration completed successfully.');
        await connection.end();
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
