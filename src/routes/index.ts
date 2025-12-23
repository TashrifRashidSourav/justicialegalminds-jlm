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
        // Fetch featured services (first 3)
        const [services] = await db.query<Service[]>(
            'SELECT * FROM services WHERE is_active = true ORDER BY sort_order LIMIT 3'
        );

        res.render('pages/home', {
            title: 'Justicia Legal Minds - Expert Legal Solutions',
            services
        });
    } catch (error) {
        console.error('Error fetching services:', error);
        res.render('pages/home', {
            title: 'Justicia Legal Minds - Expert Legal Solutions',
            services: []
        });
    }
});

export default router;
