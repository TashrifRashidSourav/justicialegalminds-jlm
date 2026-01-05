// Quick test script to check database and password
import bcrypt from 'bcrypt';
import db from './src/database/db';
import { RowDataPacket } from 'mysql2/promise';

interface User extends RowDataPacket {
    id: number;
    username: string;
    password: string;
}

async function test() {
    try {
        console.log('Testing database connection...');

        // Check if users table exists
        const [users] = await db.query<User[]>('SELECT * FROM users WHERE username = ?', ['admin']);

        if (users.length === 0) {
            console.log('❌ No admin user found in database!');
            console.log('Run this SQL:');
            console.log(`INSERT INTO users (username, email, password, role) VALUES ('admin', 'admin@justicialegalminds.com', '$2b$10$Sso9pGgqPQzoq', 'admin');`);
            return;
        }

        const user = users[0];
        console.log('✅ Admin user found');
        console.log('Username:', user.username);
        console.log('Password hash in DB:', user.password);

        // Test password
        const testPassword = 'admin123';
        const match = await bcrypt.compare(testPassword, user.password);

        console.log('\nPassword test:');
        console.log('Testing password:', testPassword);
        console.log('Match:', match ? '✅ YES' : '❌ NO');

        if (!match) {
            console.log('\n❌ Password does not match!');
            console.log('Run this SQL to fix:');
            const hash = await bcrypt.hash(testPassword, 10);
            console.log(`UPDATE users SET password = '${hash}' WHERE username = 'admin';`);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await db.end();
    }
}

test();
