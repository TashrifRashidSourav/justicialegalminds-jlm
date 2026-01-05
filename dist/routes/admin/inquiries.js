"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middleware/auth");
const db_1 = __importDefault(require("../../database/db"));
const router = (0, express_1.Router)();
// List all inquiries
router.get('/', auth_1.requireAuth, async (req, res) => {
    try {
        const [inquiries] = await db_1.default.query('SELECT * FROM inquiries ORDER BY created_at DESC');
        res.render('admin/inquiries/list', { title: 'Contact Inquiries', inquiries });
    }
    catch (error) {
        console.error('Error:', error);
        req.flash('error', 'Failed to load inquiries');
        res.redirect('/admin/dashboard');
    }
});
// Mark as read
router.post('/read/:id', auth_1.requireAuth, async (req, res) => {
    try {
        await db_1.default.query('UPDATE inquiries SET is_read = true WHERE id = ?', [req.params.id]);
        req.flash('success', 'Marked as read');
        res.redirect('/admin/inquiries');
    }
    catch (error) {
        console.error('Error:', error);
        req.flash('error', 'Failed to update inquiry');
        res.redirect('/admin/inquiries');
    }
});
// Delete inquiry
router.post('/delete/:id', auth_1.requireAuth, async (req, res) => {
    try {
        await db_1.default.query('DELETE FROM inquiries WHERE id = ?', [req.params.id]);
        req.flash('success', 'Inquiry deleted');
        res.redirect('/admin/inquiries');
    }
    catch (error) {
        console.error('Error:', error);
        req.flash('error', 'Failed to delete inquiry');
        res.redirect('/admin/inquiries');
    }
});
exports.default = router;
