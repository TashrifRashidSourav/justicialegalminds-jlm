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
        // Fetch featured services (first 3)
        const [services] = await db_1.default.query('SELECT * FROM services WHERE is_active = true ORDER BY sort_order LIMIT 3');
        // Fetch hero settings
        const [settings] = await db_1.default.query("SELECT * FROM page_sections WHERE `key` = 'hero'");
        let heroData = {
            title: 'Justicia Legal Minds',
            subtitle: 'Expert Legal Solutions for Your Peace of Mind',
            buttonText: 'Book a Consultation',
            buttonLink: '/contact',
            backgroundColor: '#2c3e50',
            textColor: '#ffffff',
            subtitleColor: '#ecf0f1',
            buttonColor: '#d4af37',
            buttonTextColor: '#000000',
            backgroundImage: ''
        };
        if (settings.length > 0 && settings[0].data) {
            const data = typeof settings[0].data === 'string'
                ? JSON.parse(settings[0].data)
                : settings[0].data;
            heroData = { ...heroData, ...data };
        }
        res.render('pages/home', {
            title: 'Justicia Legal Minds - Expert Legal Solutions',
            services,
            heroData
        });
    }
    catch (error) {
        console.error('Error fetching services:', error);
        res.render('pages/home', {
            title: 'Justicia Legal Minds - Expert Legal Solutions',
            services: []
        });
    }
});
exports.default = router;
