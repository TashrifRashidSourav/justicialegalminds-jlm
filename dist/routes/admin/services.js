"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middleware/auth");
const upload_1 = require("../../middleware/upload");
const db_1 = __importDefault(require("../../database/db"));
const router = (0, express_1.Router)();
// List all services
router.get('/', auth_1.requireAuth, async (req, res) => {
    try {
        const [services] = await db_1.default.query('SELECT * FROM services ORDER BY sort_order');
        res.render('admin/services/list', { title: 'Manage Services', services });
    }
    catch (error) {
        console.error('Error:', error);
        req.flash('error', 'Failed to load services');
        res.redirect('/admin/dashboard');
    }
});
// Edit service form
router.get('/edit/:id', auth_1.requireAuth, async (req, res) => {
    try {
        const [services] = await db_1.default.query('SELECT * FROM services WHERE id = ?', [req.params.id]);
        if (services.length === 0) {
            req.flash('error', 'Service not found');
            return res.redirect('/admin/services');
        }
        res.render('admin/services/edit', { title: 'Edit Service', service: services[0] });
    }
    catch (error) {
        console.error('Error:', error);
        req.flash('error', 'Failed to load service');
        res.redirect('/admin/services');
    }
});
// Update service
router.post('/edit/:id', auth_1.requireAuth, upload_1.upload.single('image'), async (req, res) => {
    const { title, slug, description, is_active, sort_order } = req.body;
    // Server-side validation
    if (!title || !slug) {
        req.flash('error', 'Update Failed: Title and Slug are required.');
        return res.redirect(`/admin/services/edit/${req.params.id}`);
    }
    try {
        if (req.file) {
            const iconPath = '/uploads/services/' + req.file.filename;
            await db_1.default.query('UPDATE services SET title = ?, slug = ?, description = ?, icon = ?, is_active = ?, sort_order = ? WHERE id = ?', [title, slug, description, iconPath, is_active ? 1 : 0, sort_order, req.params.id]);
        }
        else {
            await db_1.default.query('UPDATE services SET title = ?, slug = ?, description = ?, is_active = ?, sort_order = ? WHERE id = ?', [title, slug, description, is_active ? 1 : 0, sort_order, req.params.id]);
        }
        req.flash('success', 'Service updated successfully');
        res.redirect('/admin/services');
    }
    catch (error) {
        console.error('Error:', error);
        req.flash('error', 'Failed to update service');
        res.redirect('/admin/services/edit/' + req.params.id);
    }
});
// Add service form
router.get('/add', auth_1.requireAuth, (req, res) => {
    res.render('admin/services/add', { title: 'Add Service' });
});
// Create service
router.post('/add', auth_1.requireAuth, upload_1.upload.single('image'), async (req, res) => {
    const { title, slug, description, is_active, sort_order } = req.body;
    let iconPath = null;
    if (req.file) {
        iconPath = '/uploads/services/' + req.file.filename;
    }
    try {
        await db_1.default.query('INSERT INTO services (title, slug, description, icon, is_active, sort_order) VALUES (?, ?, ?, ?, ?, ?)', [title, slug, description, iconPath, is_active ? 1 : 0, sort_order || 99]);
        req.flash('success', 'Service added successfully');
        res.redirect('/admin/services');
    }
    catch (error) {
        console.error('Error:', error);
        req.flash('error', 'Failed to add service');
        res.redirect('/admin/services/add');
    }
});
// Delete service
router.post('/delete/:id', auth_1.requireAuth, async (req, res) => {
    try {
        await db_1.default.query('DELETE FROM services WHERE id = ?', [req.params.id]);
        req.flash('success', 'Service deleted successfully');
        res.redirect('/admin/services');
    }
    catch (error) {
        console.error('Error:', error);
        req.flash('error', 'Failed to delete service');
        res.redirect('/admin/services');
    }
});
exports.default = router;
