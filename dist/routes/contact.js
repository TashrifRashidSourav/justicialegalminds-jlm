"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../database/db"));
const router = (0, express_1.Router)();
// Helper to get contact data
const getContactData = async () => {
    let contactData = {
        email: 'justicialegalminds@gmail.com',
        phone: '01999585858',
        address: 'ফ্লাট ২/এ , বাড়ি নং ৮৮, রাস্তা ১৭/এ , ব্লক ই ,বনানী,ঢাকা-১২১৩'
    };
    try {
        const [settings] = await db_1.default.query("SELECT * FROM page_sections WHERE `key` = 'contact_info'");
        if (settings.length > 0 && settings[0].data) {
            const data = typeof settings[0].data === 'string' ? JSON.parse(settings[0].data) : settings[0].data;
            contactData = { ...contactData, ...data };
        }
    }
    catch (error) {
        console.error('Error loading contact info:', error);
    }
    return contactData;
};
// Show contact form
router.get('/', async (req, res) => {
    const contactData = await getContactData();
    res.render('pages/contact', {
        title: 'Contact Us - Justicia Legal Minds',
        success: false,
        error: null,
        contactData
    });
});
// Handle contact form submission
router.post('/', async (req, res) => {
    const { name, email, phone, subject, message } = req.body;
    const contactData = await getContactData();
    // Validation
    if (!name || !email || !message) {
        return res.render('pages/contact', {
            title: 'Contact Us - Justicia Legal Minds',
            success: false,
            error: 'Please fill in all required fields',
            contactData
        });
    }
    try {
        await db_1.default.query('INSERT INTO inquiries (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)', [name, email, phone || null, subject || null, message]);
        res.render('pages/contact', {
            title: 'Contact Us - Justicia Legal Minds',
            success: true,
            error: null,
            contactData
        });
    }
    catch (error) {
        console.error('Error saving inquiry:', error);
        res.render('pages/contact', {
            title: 'Contact Us - Justicia Legal Minds',
            success: false,
            error: 'Failed to send message. Please try again.',
            contactData
        });
    }
});
exports.default = router;
