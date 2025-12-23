import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.render('pages/about', {
        title: 'About Us - Justicia Legal Minds'
    });
});

export default router;
