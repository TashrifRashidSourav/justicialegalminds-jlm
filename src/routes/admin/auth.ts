import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import db from '../../database/db';
import { RowDataPacket } from 'mysql2/promise';

interface User extends RowDataPacket {
    id: number;
    username: string;
    email: string;
    password: string;
    role: string;
    is_active: boolean;
}

const router = Router();

// Login page
router.get('/login', (req: Request, res: Response) => {
    if (req.session && req.session.userId) {
        return res.redirect('/admin/dashboard');
    }

    res.render('admin/login', {
        title: 'Admin Login'
    });
});

// Login handler
router.post('/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        const [users] = await db.query<User[]>(
            'SELECT * FROM users WHERE username = ? AND is_active = true LIMIT 1',
            [username]
        );

        if (users.length === 0) {
            req.flash('error', 'Invalid username or password');
            return res.redirect('/admin/login');
        }

        const user = users[0];

        // Temporary: Accept plain text password for testing
        // TODO: Use bcrypt in production
        const passwordMatch = password === user.password || await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            req.flash('error', 'Invalid username or password');
            return res.redirect('/admin/login');
        }

        req.session.userId = user.id;
        req.session.username = user.username;
        req.session.role = user.role;

        req.flash('success', 'Welcome back, ' + user.username + '!');
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error('Login error:', error);
        req.flash('error', 'An error occurred. Please try again.');
        res.redirect('/admin/login');
    }
});

// Logout
router.get('/logout', (req: Request, res: Response) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
        }
        res.redirect('/admin/login');
    });
});

// Redirect /admin to dashboard or login
router.get('/', (req: Request, res: Response) => {
    if (req.session && req.session.userId) {
        res.redirect('/admin/dashboard');
    } else {
        res.redirect('/admin/login');
    }
});

export default router;
