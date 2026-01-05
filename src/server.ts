import express, { Express, Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import compression from 'compression';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cors from 'cors';
import session from 'express-session';
import flash from 'connect-flash';

// Load environment variables
dotenv.config();

// Import routes
import indexRouter from './routes/index';
import aboutRouter from './routes/about';
import servicesRouter from './routes/services';
import teamRouter from './routes/team';
import contactRouter from './routes/contact';

// Import admin routes
import adminAuthRouter from './routes/admin/auth';
import adminDashboardRouter from './routes/admin/dashboard';
import adminServicesRouter from './routes/admin/services';
import adminTeamRouter from './routes/admin/team';
import adminInquiriesRouter from './routes/admin/inquiries';
import adminSettingsRouter from './routes/admin/settings';

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
    contentSecurityPolicy: false,
}));
app.use(cors());
app.use(compression());

// Database import
import db from './database/db';

// Session middleware
const MySQLStore = require('express-mysql-session')(session);

// Use existing connection pool
const sessionStore = new MySQLStore({
    clearExpired: true,
    checkExpirationInterval: 900000,
    expiration: 86400000
    // No connection details needed, utilizing the pool
}, db as any); // cast to any if type mismatch occurs with pool vs connection

app.use(session({
    name: 'session_cookie_name',
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-this',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    proxy: true, // Crucial for cPanel/Nginx proxies
    cookie: {
        secure: process.env.NODE_ENV === 'production' && process.env.SECURE_COOKIE === 'true', // Allow http if SECURE_COOKIE not set
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true
    }
}));

// Flash messages
app.use(flash());

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Static files
app.use(express.static(path.join(__dirname, '../public')));

// Make flash messages available in all views
// Make flash messages available in all views

// Make flash messages and global settings available in all views
app.use(async (req: Request, res: Response, next: NextFunction) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.user = req.session.userId ? { username: req.session.username, role: req.session.role } : null;

    // Fetch global settings (logo, etc)
    try {
        const [settings] = await db.query<any[]>(
            "SELECT * FROM page_sections WHERE `key` = 'general_info'"
        );
        if (settings.length > 0 && settings[0].data) {
            const data = typeof settings[0].data === 'string' ? JSON.parse(settings[0].data) : settings[0].data;
            res.locals.generalInfo = data;
        } else {
            res.locals.generalInfo = {};
        }
    } catch (err) {
        console.error("Error fetching global settings:", err);
        res.locals.generalInfo = {};
    }

    next();
});

// Public routes
app.use('/', indexRouter);
app.use('/about', aboutRouter);
app.use('/services', servicesRouter);
app.use('/team', teamRouter);
app.use('/contact', contactRouter);

// Admin routes
app.use('/admin', adminAuthRouter);
app.use('/admin/dashboard', adminDashboardRouter);
app.use('/admin/services', adminServicesRouter);
app.use('/admin/team', adminTeamRouter);
app.use('/admin/inquiries', adminInquiriesRouter);
app.use('/admin/settings', adminSettingsRouter);

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).render('pages/404', {
        title: '404 - Page Not Found',
        path: req.path
    });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    // DEBUG: Show actual error including stack trace to identify upload issue
    res.status(500).render('pages/error', {
        title: 'Error',
        message: err.message + (err.stack ? '\n' + err.stack.split('\n')[0] : '')
    });
});

// FIX PERMISSIONS ON STARTUP
const uploadDirs = [
    path.join(__dirname, '../public/uploads'),
    path.join(__dirname, '../public/uploads/team'),
    path.join(__dirname, '../public/uploads/services'),
    path.join(__dirname, '../public/uploads/settings'),
    path.join(__dirname, '../public/uploads/misc')
];

uploadDirs.forEach(dir => {
    try {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        // Force 777 permissions to fix EACCES errors
        fs.chmodSync(dir, 0o777);
        console.log(`✅ Permissions fixed (777) for: ${dir}`);
    } catch (err: any) {
        console.warn(`Warning: Could not set permissions for ${dir}:`, err.message);
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`💾 Memory usage: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`);
    console.log(`🔐 Admin panel: http://localhost:${PORT}/admin`);
});

export default app;
