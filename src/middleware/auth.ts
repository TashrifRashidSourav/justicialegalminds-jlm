import { Request, Response, NextFunction } from 'express';

declare module 'express-session' {
    interface SessionData {
        userId?: number;
        username?: string;
        role?: string;
    }
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if (req.session && req.session.userId) {
        next();
    } else {
        res.redirect('/admin/login');
    }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.session && req.session.userId && req.session.role === 'admin') {
        next();
    } else {
        res.redirect('/admin');
    }
};
