import { Router, Request, Response } from 'express';
import db from '../database/db';

const router = Router();

// Show contact form
router.get('/', (req: Request, res: Response) => {
    res.render('pages/contact', {
        title: 'Contact Us - Justicia Legal Minds',
        success: false,
        error: null
    });
});

// Handle contact form submission
router.post('/', async (req: Request, res: Response) => {
    const { name, email, phone, subject, message } = req.body;

    // Validation
    if (!name || !email || !message) {
        return res.render('pages/contact', {
            title: 'Contact Us - Justicia Legal Minds',
            success: false,
            error: 'Please fill in all required fields'
        });
    }

    try {
        await db.query(
            'INSERT INTO inquiries (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
            [name, email, phone || null, subject || null, message]
        );

        res.render('pages/contact', {
            title: 'Contact Us - Justicia Legal Minds',
            success: true,
            error: null
        });
    } catch (error) {
        console.error('Error saving inquiry:', error);
        res.render('pages/contact', {
            title: 'Contact Us - Justicia Legal Minds',
            success: false,
            error: 'Failed to send message. Please try again.'
        });
    }
});

export default router;
