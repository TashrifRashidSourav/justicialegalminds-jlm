import { Router, Request, Response } from 'express';
import db from '../database/db';
import { RowDataPacket } from 'mysql2/promise';

interface TeamMember extends RowDataPacket {
    id: number;
    name: string;
    role: string;
    bio: string | null;
    image: string | null;
    sort_order: number;
    is_active: boolean;
}

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const [team] = await db.query<TeamMember[]>(
            'SELECT * FROM team_members WHERE is_active = true ORDER BY sort_order'
        );

        res.render('pages/team', {
            title: 'Our Team - Justicia Legal Minds',
            team
        });
    } catch (error) {
        console.error('Error fetching team:', error);
        res.status(500).render('pages/error', {
            title: 'Error',
            message: 'Failed to load team members'
        });
    }
});

export default router;
