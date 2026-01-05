"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Ensure upload directories exist
const uploadDirs = [
    path_1.default.join(__dirname, '../../public/uploads/team'),
    path_1.default.join(__dirname, '../../public/uploads/services')
];
uploadDirs.forEach(dir => {
    try {
        if (!fs_1.default.existsSync(dir)) {
            fs_1.default.mkdirSync(dir, { recursive: true });
        }
    }
    catch (error) {
        console.warn(`Warning: Could not create upload directory ${dir}:`, error);
        // Continue execution even if directory creation fails
    }
});
// Configure storage
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        let uploadPath = 'public/uploads/misc';
        if (req.baseUrl.includes('team')) {
            uploadPath = 'public/uploads/team';
        }
        else if (req.baseUrl.includes('services')) {
            uploadPath = 'public/uploads/services';
        }
        else if (req.baseUrl.includes('settings')) {
            uploadPath = 'public/uploads/settings';
        }
        // CRAFT SAFE ABSOLUTE PATH
        // Go up from src/middleware to root, then into public/...
        const fullPath = path_1.default.resolve(__dirname, '../../', uploadPath);
        try {
            if (!fs_1.default.existsSync(fullPath)) {
                fs_1.default.mkdirSync(fullPath, { recursive: true });
            }
            // If successful, pass the relative path that Multer expects (or absolute, but relative is safer for static serving)
            // Actually, for diskStorage, 'destination' can be a string (path).
            // We pass the absolute path to ensure certainty.
            cb(null, fullPath);
        }
        catch (error) {
            console.error(`CRITICAL: Failed to create upload directory ${fullPath}:`, error);
            // Fallback to simpler temp dir or just try to proceed (which might fail file write, but not crash app immediately)
            // Attempting to use the temp directory as last resort logic could go here
            cb(null, path_1.default.join(process.cwd(), 'public/uploads/misc'));
        }
    },
    filename: function (req, file, cb) {
        // Sanitize filename to remove weird chars
        const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + safeName);
    }
});
// File filter (Unchanged)
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path_1.default.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    // RELAXED VALIDATION: Allow if EITHER extension OR mimetype matches
    // This fixes issues where browser sends 'application/octet-stream' for images
    if (extname || mimetype) {
        return cb(null, true);
    }
    else {
        // Detailed error for debugging
        const msg = `Only images are allowed. Got type: ${file.mimetype}, ext: ${path_1.default.extname(file.originalname)}`;
        cb(new Error(msg));
    }
};
exports.upload = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: fileFilter
});
