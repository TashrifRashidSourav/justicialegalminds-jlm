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

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const [rows] = await db.query<TeamMember[]>(
            'SELECT * FROM team_members WHERE id = ? AND is_active = true',
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).render('pages/404', { title: 'Member Not Found' });
        }

        res.render('pages/team-member', {
            title: `${rows[0].name} - Justicia Legal Minds`,
            member: rows[0]
        });
    } catch (error) {
        console.error('Error fetching team member:', error);
        res.status(500).render('pages/error', {
            title: 'Error',
            message: 'Failed to load team member profile'
        });
    }
});

export default router;
