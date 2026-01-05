"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
const compression_1 = __importDefault(require("compression"));
const helmet_1 = __importDefault(require("helmet"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const connect_flash_1 = __importDefault(require("connect-flash"));
// Load environment variables
dotenv_1.default.config();
// Import routes
const index_1 = __importDefault(require("./routes/index"));
const about_1 = __importDefault(require("./routes/about"));
const services_1 = __importDefault(require("./routes/services"));
const team_1 = __importDefault(require("./routes/team"));
const contact_1 = __importDefault(require("./routes/contact"));
// Import admin routes
const auth_1 = __importDefault(require("./routes/admin/auth"));
const dashboard_1 = __importDefault(require("./routes/admin/dashboard"));
const services_2 = __importDefault(require("./routes/admin/services"));
const team_2 = __importDefault(require("./routes/admin/team"));
const inquiries_1 = __importDefault(require("./routes/admin/inquiries"));
const settings_1 = __importDefault(require("./routes/admin/settings"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Security middleware
app.use((0, helmet_1.default)({
    contentSecurityPolicy: false,
}));
app.use((0, cors_1.default)());
app.use((0, compression_1.default)());
// Database import
const db_1 = __importDefault(require("./database/db"));
// Session middleware
const MySQLStore = require('express-mysql-session')(express_session_1.default);
// Use existing connection pool
const sessionStore = new MySQLStore({
    clearExpired: true,
    checkExpirationInterval: 900000,
    expiration: 86400000
    // No connection details needed, utilizing the pool
}, db_1.default); // cast to any if type mismatch occurs with pool vs connection
app.use((0, express_session_1.default)({
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
app.use((0, connect_flash_1.default)());
// Body parser middleware
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
// View engine setup
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(__dirname, '../views'));
// Static files
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
// Make flash messages available in all views
// Make flash messages available in all views
// Make flash messages and global settings available in all views
app.use(async (req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.user = req.session.userId ? { username: req.session.username, role: req.session.role } : null;
    // Fetch global settings (logo, etc)
    try {
        const [settings] = await db_1.default.query("SELECT * FROM page_sections WHERE `key` = 'general_info'");
        if (settings.length > 0 && settings[0].data) {
            const data = typeof settings[0].data === 'string' ? JSON.parse(settings[0].data) : settings[0].data;
            res.locals.generalInfo = data;
        }
        else {
            res.locals.generalInfo = {};
        }
    }
    catch (err) {
        console.error("Error fetching global settings:", err);
        res.locals.generalInfo = {};
    }
    next();
});
// Public routes
app.use('/', index_1.default);
app.use('/about', about_1.default);
app.use('/services', services_1.default);
app.use('/team', team_1.default);
app.use('/contact', contact_1.default);
// Admin routes
app.use('/admin', auth_1.default);
app.use('/admin/dashboard', dashboard_1.default);
app.use('/admin/services', services_2.default);
app.use('/admin/team', team_2.default);
app.use('/admin/inquiries', inquiries_1.default);
app.use('/admin/settings', settings_1.default);
// 404 handler
app.use((req, res) => {
    res.status(404).render('pages/404', {
        title: '404 - Page Not Found',
        path: req.path
    });
});
// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    // DEBUG: Show actual error including stack trace to identify upload issue
    res.status(500).render('pages/error', {
        title: 'Error',
        message: err.message + (err.stack ? '\n' + err.stack.split('\n')[0] : '')
    });
});
// FIX PERMISSIONS ON STARTUP
const uploadDirs = [
    path_1.default.join(__dirname, '../public/uploads'),
    path_1.default.join(__dirname, '../public/uploads/team'),
    path_1.default.join(__dirname, '../public/uploads/services'),
    path_1.default.join(__dirname, '../public/uploads/settings'),
    path_1.default.join(__dirname, '../public/uploads/misc')
];
uploadDirs.forEach(dir => {
    try {
        if (!fs_1.default.existsSync(dir)) {
            fs_1.default.mkdirSync(dir, { recursive: true });
        }
        // Force 777 permissions to fix EACCES errors
        fs_1.default.chmodSync(dir, 0o777);
        console.log(`✅ Permissions fixed (777) for: ${dir}`);
    }
    catch (err) {
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
exports.default = app;
