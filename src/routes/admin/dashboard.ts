import { Router, Request, Response } from 'express';
import { requireAuth } from '../../middleware/auth';
import db from '../../database/db';
import { RowDataPacket } from 'mysql2/promise';

const router = Router();

router.get('/', requireAuth, async (req: Request, res: Response) => {
    try {
        const [services] = await db.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM services');
        const [team] = await db.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM team_members');
        const [inquiries] = await db.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM inquiries');
        const [unread] = await db.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM inquiries WHERE is_read = false');
        const [recentInquiries] = await db.query<RowDataPacket[]>(
            'SELECT * FROM inquiries ORDER BY created_at DESC LIMIT 5'
        );

        res.render('admin/dashboard', {
            title: 'Admin Dashboard',
            stats: {
                services: services[0].count,
                team: team[0].count,
                inquiries: inquiries[0].count,
                unread: unread[0].count
            },
            recentInquiries
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).send('Error loading dashboard');
    }
});

export default router;
