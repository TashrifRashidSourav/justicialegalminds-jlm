"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    res.render('pages/about', {
        title: 'About Us - Justicia Legal Minds'
    });
});
exports.default = router;
