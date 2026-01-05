"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../database/db"));
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    try {
        const [team] = await db_1.default.query('SELECT * FROM team_members WHERE is_active = true ORDER BY sort_order');
        res.render('pages/team', {
            title: 'Our Team - Justicia Legal Minds',
            team
        });
    }
    catch (error) {
        console.error('Error fetching team:', error);
        res.status(500).render('pages/error', {
            title: 'Error',
            message: 'Failed to load team members'
        });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db_1.default.query('SELECT * FROM team_members WHERE id = ? AND is_active = true', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).render('pages/404', { title: 'Member Not Found' });
        }
        res.render('pages/team-member', {
            title: `${rows[0].name} - Justicia Legal Minds`,
            member: rows[0]
        });
    }
    catch (error) {
        console.error('Error fetching team member:', error);
        res.status(500).render('pages/error', {
            title: 'Error',
            message: 'Failed to load team member profile'
        });
    }
});
exports.default = router;
