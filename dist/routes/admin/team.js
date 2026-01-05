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
// List all team members
router.get('/', auth_1.requireAuth, async (req, res) => {
    try {
        const [team] = await db_1.default.query('SELECT * FROM team_members ORDER BY sort_order');
        res.render('admin/team/list', { title: 'Manage Team', team });
    }
    catch (error) {
        console.error('Error:', error);
        req.flash('error', 'Failed to load team members');
        res.redirect('/admin/dashboard');
    }
});
// Edit team member form
router.get('/edit/:id', auth_1.requireAuth, async (req, res) => {
    try {
        const [team] = await db_1.default.query('SELECT * FROM team_members WHERE id = ?', [req.params.id]);
        if (team.length === 0) {
            req.flash('error', 'Team member not found');
            return res.redirect('/admin/team');
        }
        res.render('admin/team/edit', { title: 'Edit Team Member', member: team[0] });
    }
    catch (error) {
        console.error('Error:', error);
        req.flash('error', 'Failed to load team member');
        res.redirect('/admin/team');
    }
});
// Update team member
router.post('/edit/:id', auth_1.requireAuth, upload_1.upload.single('image'), async (req, res) => {
    // Debug logging
    console.log('--- Team Update Debug ---');
    console.log('Params ID:', req.params.id);
    console.log('Body:', req.body);
    console.log('File:', req.file);
    const { name, role, bio, email, phone, practice_areas, is_active, sort_order } = req.body;
    // Server-side validation
    if (!name || !role) {
        console.error('Validation Failed: Name or Role missing');
        req.flash('error', 'Update Failed: Name and Role are required.');
        return res.redirect(`/admin/team/edit/${req.params.id}`);
    }
    try {
        if (req.file) {
            const imagePath = '/uploads/team/' + req.file.filename;
            await db_1.default.query('UPDATE team_members SET name = ?, role = ?, bio = ?, email = ?, phone = ?, practice_areas = ?, image = ?, is_active = ?, sort_order = ? WHERE id = ?', [name, role, bio, email, phone, practice_areas, imagePath, is_active ? 1 : 0, sort_order, req.params.id]);
        }
        else {
            await db_1.default.query('UPDATE team_members SET name = ?, role = ?, bio = ?, email = ?, phone = ?, practice_areas = ?, is_active = ?, sort_order = ? WHERE id = ?', [name, role, bio, email, phone, practice_areas, is_active ? 1 : 0, sort_order, req.params.id]);
        }
        req.flash('success', 'Team member updated successfully');
        res.redirect('/admin/team');
    }
    catch (error) {
        console.error('Error:', error);
        req.flash('error', 'Failed to update team member');
        res.redirect('/admin/team/edit/' + req.params.id);
    }
});
// Add team member form
router.get('/add', auth_1.requireAuth, (req, res) => {
    res.render('admin/team/add', { title: 'Add Team Member' });
});
// Create team member
router.post('/add', auth_1.requireAuth, upload_1.upload.single('image'), async (req, res) => {
    console.log('--- Team Add Debug ---');
    console.log('Body:', req.body);
    console.log('File:', req.file);
    const { name, role, bio, email, phone, practice_areas, is_active, sort_order } = req.body;
    // Server-side validation
    if (!name || !role) {
        console.error('Validation Failed: Name or Role missing');
        req.flash('error', 'Add Failed: Name and Role are required.');
        return res.redirect('/admin/team/add');
    }
    let imagePath = null;
    if (req.file) {
        imagePath = '/uploads/team/' + req.file.filename;
    }
    try {
        await db_1.default.query('INSERT INTO team_members (name, role, bio, email, phone, practice_areas, image, is_active, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [name, role, bio, email, phone, practice_areas, imagePath, is_active ? 1 : 0, sort_order || 99]);
        console.log('Team member added successfully');
        req.flash('success', 'Team member added successfully');
        res.redirect('/admin/team');
    }
    catch (error) {
        console.error('Error adding team member:', error);
        req.flash('error', 'Failed to add team member');
        res.redirect('/admin/team/add');
    }
});
// Delete team member
router.post('/delete/:id', auth_1.requireAuth, async (req, res) => {
    console.log('--- Team Delete Debug ---');
    console.log('Deleting ID:', req.params.id);
    try {
        await db_1.default.query('DELETE FROM team_members WHERE id = ?', [req.params.id]);
        console.log('Team member deleted successfully');
        req.flash('success', 'Team member deleted successfully');
        res.redirect('/admin/team');
    }
    catch (error) {
        console.error('Error deleting team member:', error);
        req.flash('error', 'Failed to delete team member');
        res.redirect('/admin/team');
    }
});
exports.default = router;
