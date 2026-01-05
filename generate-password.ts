// Script to generate bcrypt password hash for admin user
import bcrypt from 'bcryptjs';

const password = 'admin123'; // Change this to your desired password
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
        console.error('Error generating hash:', err);
        return;
    }
    console.log('\n=== Admin Password Hash ===');
    console.log('Password:', password);
    console.log('Hash:', hash);
    console.log('\nUse this SQL to create admin user:');
    console.log(`INSERT INTO users (username, email, password, role) VALUES ('admin', 'admin@justicialegalminds.com', '${hash}', 'admin');`);
    console.log('\n');
});
