const fs = require('fs');
const path = require('path');

console.log('--- Justicial Legal Minds: Setup Uploads Script (V10: FORCE 777) ---');

// Define upload directories
const uploadDirs = [
    'public/uploads',
    'public/uploads/team',
    'public/uploads/services',
    'public/uploads/settings',
    'public/uploads/misc'
];

// Helper to fix permissions
function fixPermissions(dirPath) {
    const fullPath = path.resolve(__dirname, dirPath);

    try {
        // 1. Create directory if missing
        if (!fs.existsSync(fullPath)) {
            console.log(`Creating directory: ${fullPath}`);
            fs.mkdirSync(fullPath, { recursive: true });
        }

        // 2. Set permissions to 777 (World Writable)
        // This is necessary because the Node process user usually differs
        // from the file owner (upload user) in cPanel/Phusion setups.
        console.log(`Setting permissions to 777 for: ${fullPath}`);
        fs.chmodSync(fullPath, 0o777);

        console.log(`✅ Success (777): ${dirPath}`);
    } catch (error) {
        console.error(`❌ Failed to setup ${dirPath}:`, error.message);
    }
}

// Execute
uploadDirs.forEach(fixPermissions);

console.log('--- Setup Complete ---');
