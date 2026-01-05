import { Router, Request, Response } from 'express';
import { requireAuth } from '../../middleware/auth';
import { upload } from '../../middleware/upload';
import db from '../../database/db';
import { RowDataPacket } from 'mysql2/promise';

interface Service extends RowDataPacket {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    icon: string | null;
    is_active: boolean;
    sort_order: number;
}

const router = Router();

// List all services
router.get('/', requireAuth, async (req: Request, res: Response) => {
    try {
        const [services] = await db.query<Service[]>(
            'SELECT * FROM services ORDER BY sort_order'
        );
        res.render('admin/services/list', { title: 'Manage Services', services });
    } catch (error) {
        console.error('Error:', error);
        req.flash('error', 'Failed to load services');
        res.redirect('/admin/dashboard');
    }
});

// Edit service form
router.get('/edit/:id', requireAuth, async (req: Request, res: Response) => {
    try {
        const [services] = await db.query<Service[]>(
            'SELECT * FROM services WHERE id = ?',
            [req.params.id]
        );
        if (services.length === 0) {
            req.flash('error', 'Service not found');
            return res.redirect('/admin/services');
        }
        res.render('admin/services/edit', { title: 'Edit Service', service: services[0] });
    } catch (error) {
        console.error('Error:', error);
        req.flash('error', 'Failed to load service');
        res.redirect('/admin/services');
    }
});

// Update service
router.post('/edit/:id', requireAuth, upload.single('image'), async (req: Request, res: Response) => {
    const { title, slug, description, is_active, sort_order } = req.body;

    // Server-side validation
    if (!title || !slug) {
        req.flash('error', 'Update Failed: Title and Slug are required.');
        return res.redirect(`/admin/services/edit/${req.params.id}`);
    }

    try {
        if (req.file) {
            const iconPath = '/uploads/services/' + req.file.filename;
            await db.query(
                'UPDATE services SET title = ?, slug = ?, description = ?, icon = ?, is_active = ?, sort_order = ? WHERE id = ?',
                [title, slug, description, iconPath, is_active ? 1 : 0, sort_order, req.params.id]
            );
        } else {
            await db.query(
                'UPDATE services SET title = ?, slug = ?, description = ?, is_active = ?, sort_order = ? WHERE id = ?',
                [title, slug, description, is_active ? 1 : 0, sort_order, req.params.id]
            );
        }
        req.flash('success', 'Service updated successfully');
        res.redirect('/admin/services');
    } catch (error) {
        console.error('Error:', error);
        req.flash('error', 'Failed to update service');
        res.redirect('/admin/services/edit/' + req.params.id);
    }
});

// Add service form
router.get('/add', requireAuth, (req: Request, res: Response) => {
    res.render('admin/services/add', { title: 'Add Service' });
});

// Create service
router.post('/add', requireAuth, upload.single('image'), async (req: Request, res: Response) => {
    const { title, slug, description, is_active, sort_order } = req.body;
    let iconPath = null;

    if (req.file) {
        iconPath = '/uploads/services/' + req.file.filename;
    }

    try {
        await db.query(
            'INSERT INTO services (title, slug, description, icon, is_active, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
            [title, slug, description, iconPath, is_active ? 1 : 0, sort_order || 99]
        );
        req.flash('success', 'Service added successfully');
        res.redirect('/admin/services');
    } catch (error) {
        console.error('Error:', error);
        req.flash('error', 'Failed to add service');
        res.redirect('/admin/services/add');
    }
});

// Delete service
router.post('/delete/:id', requireAuth, async (req: Request, res: Response) => {
    try {
        await db.query('DELETE FROM services WHERE id = ?', [req.params.id]);
        req.flash('success', 'Service deleted successfully');
        res.redirect('/admin/services');
    } catch (error) {
        console.error('Error:', error);
        req.flash('error', 'Failed to delete service');
        res.redirect('/admin/services');
    }
});

export default router;
