"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = exports.requireAuth = void 0;
const requireAuth = (req, res, next) => {
    if (req.session && req.session.userId) {
        next();
    }
    else {
        res.redirect('/admin/login');
    }
};
exports.requireAuth = requireAuth;
const requireAdmin = (req, res, next) => {
    if (req.session && req.session.userId && req.session.role === 'admin') {
        next();
    }
    else {
        res.redirect('/admin');
    }
};
exports.requireAdmin = requireAdmin;
