"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middleware/auth");
const db_1 = __importDefault(require("../../database/db"));
const router = (0, express_1.Router)();
router.get('/', auth_1.requireAuth, async (req, res) => {
    try {
        const [services] = await db_1.default.query('SELECT COUNT(*) as count FROM services');
        const [team] = await db_1.default.query('SELECT COUNT(*) as count FROM team_members');
        const [inquiries] = await db_1.default.query('SELECT COUNT(*) as count FROM inquiries');
        const [unread] = await db_1.default.query('SELECT COUNT(*) as count FROM inquiries WHERE is_read = false');
        const [recentInquiries] = await db_1.default.query('SELECT * FROM inquiries ORDER BY created_at DESC LIMIT 5');
        res.render('admin/dashboard', {
            title: 'Admin Dashboard',
            stats: {
                services: services[0].count,
                team: team[0].count,
                inquiries: inquiries[0].count,
                unread: unread[0].count
            },
            recentInquiries
        });
    }
    catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).send('Error loading dashboard');
    }
});
exports.default = router;
