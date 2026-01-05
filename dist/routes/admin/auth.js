"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = __importDefault(require("../../database/db"));
const router = (0, express_1.Router)();
// Login page
router.get('/login', (req, res) => {
    if (req.session && req.session.userId) {
        return res.redirect('/admin/dashboard');
    }
    res.render('admin/login', {
        title: 'Admin Login'
    });
});
// Login handler
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [users] = await db_1.default.query('SELECT * FROM users WHERE username = ? AND is_active = true LIMIT 1', [username]);
        if (users.length === 0) {
            req.flash('error', 'Invalid username or password');
            return res.redirect('/admin/login');
        }
        const user = users[0];
        // Temporary: Accept plain text password for testing
        // TODO: Use bcrypt in production
        const passwordMatch = password === user.password || await bcryptjs_1.default.compare(password, user.password);
        if (!passwordMatch) {
            req.flash('error', 'Invalid username or password');
            return res.redirect('/admin/login');
        }
        req.session.userId = user.id;
        req.session.username = user.username;
        req.session.role = user.role;
        req.flash('success', 'Welcome back, ' + user.username + '!');
        res.redirect('/admin/dashboard');
    }
    catch (error) {
        console.error('Login error:', error);
        req.flash('error', 'An error occurred. Please try again.');
        res.redirect('/admin/login');
    }
});
// Logout
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
        }
        res.redirect('/admin/login');
    });
});
// Redirect /admin to dashboard or login
router.get('/', (req, res) => {
    if (req.session && req.session.userId) {
        res.redirect('/admin/dashboard');
    }
    else {
        res.redirect('/admin/login');
    }
});
exports.default = router;
