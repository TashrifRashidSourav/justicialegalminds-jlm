import { Router, Request, Response } from 'express';
import db from '../database/db';
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

router.get('/', async (req: Request, res: Response) => {
    try {
        const [services] = await db.query<Service[]>(
            'SELECT * FROM services WHERE is_active = true ORDER BY sort_order'
        );

        res.render('pages/services', {
            title: 'Our Services - Justicia Legal Minds',
            services
        });
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).render('pages/error', {
            title: 'Error',
            message: 'Failed to load services'
        });
    }
});

export default router;
