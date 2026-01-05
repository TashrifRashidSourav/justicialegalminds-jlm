import { Router, Request, Response } from 'express';
import { requireAuth } from '../../middleware/auth';
import db from '../../database/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { upload } from '../../middleware/upload';

const router = Router();

// Get website settings
router.get('/', requireAuth, async (req: Request, res: Response) => {
    try {
        const [settings] = await db.query<RowDataPacket[]>(
            "SELECT * FROM page_sections WHERE `key` IN ('hero', 'contact_info', 'general_info')"
        );

        // Default Hero Data
        let heroData = {
            title: 'Justicia Legal Minds',
            subtitle: 'Expert Legal Solutions for Your Peace of Mind',
            buttonText: 'Book a Consultation',
            buttonLink: '/contact',
            backgroundColor: '#2c3e50',
            textColor: '#ffffff',
            subtitleColor: '#ecf0f1',
            buttonColor: '#d4af37',
            buttonTextColor: '#000000',
            backgroundImage: ''
        };

        // Default Contact Data
        let contactData = {
            email: 'justicialegalminds@gmail.com',
            phone: '01999585858',
            address: 'ফ্লাট ২/এ , বাড়ি নং ৮৮, রাস্তা ১৭/এ , ব্লক ই ,বনানী,ঢাকা-১২১৩'
        };

        // Default General Data (Logo)
        let generalData = {
            logo: '/images/logo.png',
            logo_height: '40'
        };

        // Parse settings from DB
        settings.forEach(setting => {
            if (setting.key === 'hero' && setting.data) {
                const data = typeof setting.data === 'string' ? JSON.parse(setting.data) : setting.data;
                heroData = { ...heroData, ...data };
            } else if (setting.key === 'contact_info' && setting.data) {
                const data = typeof setting.data === 'string' ? JSON.parse(setting.data) : setting.data;
                contactData = { ...contactData, ...data };
            } else if (setting.key === 'general_info' && setting.data) {
                const data = typeof setting.data === 'string' ? JSON.parse(setting.data) : setting.data;
                generalData = { ...generalData, ...data };
            }
        });

        res.render('admin/settings/website', {
            title: 'Website Settings',
            heroData,
            contactData,
            generalData
        });
    } catch (error) {
        console.error('Settings error:', error);
        res.status(500).send('Error loading settings');
    }
});

// Update website settings
router.post('/', requireAuth, upload.single('logo'), async (req: Request, res: Response) => {
    const { section_key } = req.body;

    try {
        if (section_key === 'hero') {
            const {
                title, subtitle, buttonText, buttonLink,
                backgroundColor, textColor, subtitleColor,
                buttonColor, buttonTextColor, backgroundImage
            } = req.body;

            const heroData = JSON.stringify({
                title, subtitle, buttonText, buttonLink,
                backgroundColor, textColor, subtitleColor,
                buttonColor, buttonTextColor, backgroundImage
            });

            await db.query(
                "INSERT INTO page_sections (`key`, `data`) VALUES ('hero', ?) ON DUPLICATE KEY UPDATE `data` = ?",
                [heroData, heroData]
            );
        } else if (section_key === 'contact_info') {
            const { email, phone, address } = req.body;

            const contactData = JSON.stringify({
                email, phone, address
            });

            await db.query(
                "INSERT INTO page_sections (`key`, `data`) VALUES ('contact_info', ?) ON DUPLICATE KEY UPDATE `data` = ?",
                [contactData, contactData]
            );
        } else if (section_key === 'general_info') {
            // Fetch existing data first to preserve logo if not updated
            let currentLogo = '/images/logo.png';
            const { logo_height } = req.body;

            const [existing] = await db.query<RowDataPacket[]>(
                "SELECT * FROM page_sections WHERE `key` = 'general_info'"
            );

            if (existing.length > 0 && existing[0].data) {
                const data = typeof existing[0].data === 'string' ? JSON.parse(existing[0].data) : existing[0].data;
                currentLogo = data.logo || currentLogo;
            }

            if (req.file) {
                currentLogo = '/uploads/settings/' + req.file.filename;
            }

            const generalData = JSON.stringify({
                logo: currentLogo,
                logo_height: logo_height || '40'
            });

            await db.query(
                "INSERT INTO page_sections (`key`, `data`) VALUES ('general_info', ?) ON DUPLICATE KEY UPDATE `data` = ?",
                [generalData, generalData]
            );
        }

        req.flash('success', 'Website settings updated successfully!');
        res.redirect('/admin/settings');
    } catch (error) {
        console.error('Update error:', error);
        req.flash('error', 'Failed to update settings');
        res.redirect('/admin/settings');
    }
});

export default router;
