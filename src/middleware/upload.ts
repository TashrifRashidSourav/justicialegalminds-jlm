import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure upload directories exist
const uploadDirs = [
    path.join(__dirname, '../../public/uploads/team'),
    path.join(__dirname, '../../public/uploads/services')
];

uploadDirs.forEach(dir => {
    try {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    } catch (error) {
        console.warn(`Warning: Could not create upload directory ${dir}:`, error);
        // Continue execution even if directory creation fails
    }
});

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadPath = 'public/uploads/misc';

        if (req.baseUrl.includes('team')) {
            uploadPath = 'public/uploads/team';
        } else if (req.baseUrl.includes('services')) {
            uploadPath = 'public/uploads/services';
        } else if (req.baseUrl.includes('settings')) {
            uploadPath = 'public/uploads/settings';
        }

        // CRAFT SAFE ABSOLUTE PATH
        // Go up from src/middleware to root, then into public/...
        const fullPath = path.resolve(__dirname, '../../', uploadPath);

        try {
            if (!fs.existsSync(fullPath)) {
                fs.mkdirSync(fullPath, { recursive: true });
            }
            // If successful, pass the relative path that Multer expects (or absolute, but relative is safer for static serving)
            // Actually, for diskStorage, 'destination' can be a string (path).
            // We pass the absolute path to ensure certainty.
            cb(null, fullPath);
        } catch (error) {
            console.error(`CRITICAL: Failed to create upload directory ${fullPath}:`, error);
            // Fallback to simpler temp dir or just try to proceed (which might fail file write, but not crash app immediately)
            // Attempting to use the temp directory as last resort logic could go here
            cb(null, path.join(process.cwd(), 'public/uploads/misc'));
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
const fileFilter = (req: any, file: any, cb: any) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    // RELAXED VALIDATION: Allow if EITHER extension OR mimetype matches
    // This fixes issues where browser sends 'application/octet-stream' for images
    if (extname || mimetype) {
        return cb(null, true);
    } else {
        // Detailed error for debugging
        const msg = `Only images are allowed. Got type: ${file.mimetype}, ext: ${path.extname(file.originalname)}`;
        cb(new Error(msg));
    }
};

export const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: fileFilter
});
