# Express.js Application - Quick Start

## Local Development

```bash
# Install dependencies
npm install

# Build CSS
npm run build:css

# Build TypeScript
npm run build

# Start server
npm start
```

Visit: http://localhost:3000

## Deploy to cPanel

1. **Build locally:**
   ```bash
   npm run build
   npm run build:css
   ```

2. **Upload to cPanel:**
   - `dist/`
   - `views/`
   - `public/`
   - `package.json`
   - `.env` (update with production values)

3. **On cPanel:**
   ```bash
   cd ~/justicia-app/justicialegalmindss
   npm install --production
   node dist/server.js
   ```

4. **Import database:**
   - Use `database_schema.sql` in phpMyAdmin

## Memory Usage

- **Express.js:** 50-100 MB ✅
- **Next.js:** 500+ MB ❌

Perfect for cPanel shared hosting!
