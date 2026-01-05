import { Router, Request, Response } from 'express';
import { requireAuth } from '../../middleware/auth';
import db from '../../database/db';
import { RowDataPacket } from 'mysql2/promise';

interface Inquiry extends RowDataPacket {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    subject: string | null;
    message: string;
    is_read: boolean;
    created_at: Date;
}

const router = Router();

// List all inquiries
router.get('/', requireAuth, async (req: Request, res: Response) => {
    try {
        const [inquiries] = await db.query<Inquiry[]>(
            'SELECT * FROM inquiries ORDER BY created_at DESC'
        );
        res.render('admin/inquiries/list', { title: 'Contact Inquiries', inquiries });
    } catch (error) {
        console.error('Error:', error);
        req.flash('error', 'Failed to load inquiries');
        res.redirect('/admin/dashboard');
    }
});

// Mark as read
router.post('/read/:id', requireAuth, async (req: Request, res: Response) => {
    try {
        await db.query('UPDATE inquiries SET is_read = true WHERE id = ?', [req.params.id]);
        req.flash('success', 'Marked as read');
        res.redirect('/admin/inquiries');
    } catch (error) {
        console.error('Error:', error);
        req.flash('error', 'Failed to update inquiry');
        res.redirect('/admin/inquiries');
    }
});

// Delete inquiry
router.post('/delete/:id', requireAuth, async (req: Request, res: Response) => {
    try {
        await db.query('DELETE FROM inquiries WHERE id = ?', [req.params.id]);
        req.flash('success', 'Inquiry deleted');
        res.redirect('/admin/inquiries');
    } catch (error) {
        console.error('Error:', error);
        req.flash('error', 'Failed to delete inquiry');
        res.redirect('/admin/inquiries');
    }
});

export default router;
