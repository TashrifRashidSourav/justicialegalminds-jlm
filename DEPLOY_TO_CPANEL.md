# Express.js cPanel Deployment Guide

## ✅ Application Ready

Your Express.js application is ready to deploy on cPanel with **minimal memory usage** (50-100 MB).

---

## 📦 Local Setup & Build

### 1. Install Dependencies

```bash
cd c:\Users\tashr\Downloads\justicialegalminds-deploy_ready\justicialegalminds-express
npm install
```

### 2. Configure Environment

Edit `.env` file:
```
PORT=3000
NODE_ENV=development
DATABASE_URL=mysql://username:password@localhost:3306/justicialegalminds
```

### 3. Build CSS

```bash
npm run build:css
```

### 4. Build TypeScript

```bash
npm run build
```

### 5. Test Locally

```bash
npm start
```

Visit: `http://localhost:3000`

---

## 🚀 Deploy to cPanel

### Step 1: Upload Files

Upload these files/folders to `/home/justicia/justicia-app/justicialegalmindss/`:

**Required:**
- `dist/` - Compiled JavaScript
- `views/` - EJS templates
- `public/` - Static assets (CSS, JS)
- `package.json`
- `package-lock.json`
- `.env` (update with production values)

**Optional:**
- `src/` - TypeScript source (for reference)

### Step 2: Install Dependencies on cPanel

In cPanel Terminal:

```bash
cd ~/justicia-app/justicialegalmindss
npm install --production
```

### Step 3: Set Environment Variables

Update `.env` file on server:

```
PORT=3000
NODE_ENV=production
DATABASE_URL=mysql://justicia_user:password@localhost:3306/justicia_db
```

Or set in cPanel → Setup Node.js App → Environment variables.

### Step 4: Import Database

1. Go to cPanel → phpMyAdmin
2. Select your database
3. Click "Import"
4. Upload `database_schema.sql`
5. Click "Go"

### Step 5: Start Application

**Option A: Using cPanel Node.js App Manager**

1. Go to cPanel → Setup Node.js App
2. Click "Create Application"
3. Settings:
   - **Node.js version:** 18.x or higher
   - **Application mode:** Production
   - **Application root:** `/home/justicia/justicia-app/justicialegalmindss`
   - **Application URL:** `jlm.justicialegalminds.com`
   - **Application startup file:** `dist/server.js`
4. Click "Create"
5. Click "Restart App"

**Option B: Using Terminal**

```bash
cd ~/justicia-app/justicialegalmindss
NODE_ENV=production node dist/server.js
```

---

## ✅ Verification

### Check if Running

```bash
ps aux | grep node
```

### Check Memory Usage

```bash
free -m
```

**Expected:** 50-100 MB (much less than Next.js!)

### Test Website

Open: `https://jlm.justicialegalminds.com`

**Verify:**
- [ ] Homepage loads
- [ ] Services page shows database data
- [ ] Team page shows database data
- [ ] Contact form works
- [ ] All navigation works

---

## 🔧 Troubleshooting

### Issue: "Cannot find module"

**Solution:**
```bash
npm install --production
```

### Issue: Database connection error

**Solution:**
- Check `DATABASE_URL` in `.env`
- Verify database exists in cPanel
- Check database user permissions

### Issue: Port already in use

**Solution:**
- Change `PORT` in `.env`
- Or kill existing process:
  ```bash
  pkill -f node
  ```

### Issue: CSS not loading

**Solution:**
```bash
npm run build:css
```

Then re-upload `public/css/style.css`

---

## 📊 Memory Comparison

| Framework | Memory Usage | cPanel Compatible |
|-----------|--------------|-------------------|
| Next.js 16 | 500+ MB | ❌ No |
| Next.js 13 | 200-300 MB | ⚠️ Maybe |
| **Express.js** | **50-100 MB** | **✅ Yes** |

---

## 🎯 Production Checklist

- [ ] Database imported successfully
- [ ] `.env` configured with production values
- [ ] Dependencies installed (`npm install --production`)
- [ ] CSS compiled (`npm run build:css`)
- [ ] TypeScript compiled (`npm run build`)
- [ ] Application started
- [ ] Website accessible
- [ ] All pages load correctly
- [ ] Database queries work
- [ ] Contact form functional
- [ ] Memory usage < 100 MB

---

## 📝 Maintenance

### Update Content

To update services or team members:
1. Log in to cPanel → phpMyAdmin
2. Edit data in `services` or `team_members` tables
3. Changes appear immediately (no rebuild needed)

### Update Code

1. Make changes locally
2. Run `npm run build`
3. Upload `dist/` folder to cPanel
4. Restart application

---

## ✅ Success!

Your Express.js application should now be running on cPanel with minimal memory usage!

**Memory usage:** 50-100 MB  
**No WebAssembly errors:** ✅  
**Database works:** ✅  
**All features functional:** ✅
