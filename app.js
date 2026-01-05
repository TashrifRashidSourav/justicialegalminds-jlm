// cPanel Node.js Startup Shim
const fs = require('fs');
const path = require('path');

try {
    console.log('Starting app.js shim...');
    require('./dist/server.js');
} catch (error) {
    const errorMsg = `[${new Date().toISOString()}] Startup Error: ${error.stack || error}\n`;
    console.error(errorMsg);
    // Write to a log file we can check in File Manager
    fs.appendFileSync(path.join(__dirname, 'startup-error.log'), errorMsg);

    // Create a fallback server to clearly show the error in browser
    const http = require('http');
    http.createServer((req, res) => {
        res.writeHead(503, { 'Content-Type': 'text/plain' });
        res.write('Service Unavailable - Startup Error:\n\n');
        res.write(errorMsg);
        res.end();
    }).listen(process.env.PORT || 3000);
}
