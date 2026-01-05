import { Router, Request, Response } from 'express';
import { requireAuth } from '../../middleware/auth';
import { upload } from '../../middleware/upload';
import db from '../../database/db';
import { RowDataPacket } from 'mysql2/promise';

interface TeamMember extends RowDataPacket {
    id: number;
    name: string;
    role: string;
    bio: string | null;
    image: string | null;
    email: string | null;
    phone: string | null;
    practice_areas: string | null;
    sort_order: number;
    is_active: boolean;
}

const router = Router();

// List all team members
router.get('/', requireAuth, async (req: Request, res: Response) => {
    try {
        const [team] = await db.query<TeamMember[]>(
            'SELECT * FROM team_members ORDER BY sort_order'
        );
        res.render('admin/team/list', { title: 'Manage Team', team });
    } catch (error) {
        console.error('Error:', error);
        req.flash('error', 'Failed to load team members');
        res.redirect('/admin/dashboard');
    }
});

// Edit team member form
router.get('/edit/:id', requireAuth, async (req: Request, res: Response) => {
    try {
        const [team] = await db.query<TeamMember[]>(
            'SELECT * FROM team_members WHERE id = ?',
            [req.params.id]
        );
        if (team.length === 0) {
            req.flash('error', 'Team member not found');
            return res.redirect('/admin/team');
        }
        res.render('admin/team/edit', { title: 'Edit Team Member', member: team[0] });
    } catch (error) {
        console.error('Error:', error);
        req.flash('error', 'Failed to load team member');
        res.redirect('/admin/team');
    }
});

// Update team member
router.post('/edit/:id', requireAuth, upload.single('image'), async (req: Request, res: Response) => {

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
            await db.query(
                'UPDATE team_members SET name = ?, role = ?, bio = ?, email = ?, phone = ?, practice_areas = ?, image = ?, is_active = ?, sort_order = ? WHERE id = ?',
                [name, role, bio, email, phone, practice_areas, imagePath, is_active ? 1 : 0, sort_order, req.params.id]
            );
        } else {
            await db.query(
                'UPDATE team_members SET name = ?, role = ?, bio = ?, email = ?, phone = ?, practice_areas = ?, is_active = ?, sort_order = ? WHERE id = ?',
                [name, role, bio, email, phone, practice_areas, is_active ? 1 : 0, sort_order, req.params.id]
            );
        }

        req.flash('success', 'Team member updated successfully');
        res.redirect('/admin/team');
    } catch (error) {
        console.error('Error:', error);
        req.flash('error', 'Failed to update team member');
        res.redirect('/admin/team/edit/' + req.params.id);
    }
});

// Add team member form
router.get('/add', requireAuth, (req: Request, res: Response) => {
    res.render('admin/team/add', { title: 'Add Team Member' });
});

// Create team member
router.post('/add', requireAuth, upload.single('image'), async (req: Request, res: Response) => {
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
        await db.query(
            'INSERT INTO team_members (name, role, bio, email, phone, practice_areas, image, is_active, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [name, role, bio, email, phone, practice_areas, imagePath, is_active ? 1 : 0, sort_order || 99]
        );
        console.log('Team member added successfully');
        req.flash('success', 'Team member added successfully');
        res.redirect('/admin/team');
    } catch (error) {
        console.error('Error adding team member:', error);
        req.flash('error', 'Failed to add team member');
        res.redirect('/admin/team/add');
    }
});

// Delete team member
router.post('/delete/:id', requireAuth, async (req: Request, res: Response) => {
    console.log('--- Team Delete Debug ---');
    console.log('Deleting ID:', req.params.id);

    try {
        await db.query('DELETE FROM team_members WHERE id = ?', [req.params.id]);
        console.log('Team member deleted successfully');
        req.flash('success', 'Team member deleted successfully');
        res.redirect('/admin/team');
    } catch (error) {
        console.error('Error deleting team member:', error);
        req.flash('error', 'Failed to delete team member');
        res.redirect('/admin/team');
    }
});

export default router;
