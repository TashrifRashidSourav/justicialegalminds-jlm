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
        const [services] = await db_1.default.query('SELECT * FROM services WHERE is_active = true ORDER BY sort_order');
        res.render('pages/services', {
            title: 'Our Services - Justicia Legal Minds',
            services
        });
    }
    catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).render('pages/error', {
            title: 'Error',
            message: 'Failed to load services'
        });
    }
});
exports.default = router;
