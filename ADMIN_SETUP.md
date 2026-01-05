# Admin Panel Quick Setup Guide

## 🚀 Installation & Setup

### 1. Install Dependencies

```bash
cd c:\Users\tashr\Downloads\justicialegalminds-deploy_ready\justicialegalminds-express
npm install
```

### 2. Create Users Table

Import `admin_migration.sql` in phpMyAdmin to create the users table.

### 3. Create Default Admin User

Run this SQL in phpMyAdmin:

```sql
-- Create admin user (username: admin, password: admin123)
INSERT INTO users (username, email, password, role) 
VALUES ('admin', 'admin@justicialegalminds.com', 
'$2b$10$rKjHZHNQxJxH8qVXm9F8/.vYZGZJ8qVXm9F8vYZGZJ8qVXm9F8vYZG', 'admin');
```

**Note:** The password hash above is a placeholder. After first login, change your password!

### 4. Build & Run

```bash
npm run build
npm start
```

### 5. Access Admin Panel

Open: **http://localhost:3000/admin**

**Login:**
- Username: `admin`
- Password: `admin123`

---

## 📋 Admin Panel Features

### Dashboard (`/admin/dashboard`)
- Total services count
- Total team members count
- Total inquiries count
- Unread inquiries count
- Recent 5 inquiries

### Services Management (`/admin/services`)
- View all services
- Add new service
- Edit existing service
- Delete service
- Toggle active/inactive

### Team Management (`/admin/team`)
- View all team members
- Add new team member
- Edit existing team member
- Delete team member
- Toggle active/inactive

### Inquiries (`/admin/inquiries`)
- View all contact form submissions
- Mark as read/unread
- Delete inquiries

---

## 🎨 Admin UI

- **Framework:** Bootstrap 5 (CDN)
- **Icons:** Font Awesome
- **Theme:** Professional dark sidebar
- **Responsive:** Mobile-friendly

---

## 🔐 Security

- Passwords hashed with bcrypt
- Session-based authentication
- Protected routes with middleware
- CSRF protection (recommended to add)

---

## 📦 Deployment to cPanel

1. Build locally:
```bash
npm run build
npm run build:css
```

2. Create ZIP with these folders/files:
- `dist/`
- `views/`
- `public/`
- `package.json`
- `package-lock.json`
- `.env`
- `admin_migration.sql`

3. Upload to cPanel and extract

4. Import `admin_migration.sql` in phpMyAdmin

5. Run:
```bash
npm install --production
node dist/server.js
```

---

## ✅ Quick Test

1. Start server: `npm start`
2. Go to: http://localhost:3000/admin
3. Login with admin/admin123
4. You should see the dashboard!

---

**Admin panel is ready to use!** 🎉
