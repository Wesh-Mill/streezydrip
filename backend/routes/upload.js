const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { verifyToken } = require('../middleware');

const router = express.Router();

// Créer le dossier uploads s'il n'existe pas
const uploadsDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configuration multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        // Générer un nom unique: timestamp + nom original
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Filtre: accepter seulement les images
const fileFilter = (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Seules les images sont acceptées (JPG, PNG, WEBP)'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

// Upload image (admin only)
router.post('/image', verifyToken, upload.single('image'), (req, res) => {
    if (!req.user || req.user.role !== 'admin') {
        // Supprimer le fichier si pas admin
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        return res.status(403).json({ error: 'Accès refusé - Admin requis' });
    }

    if (!req.file) {
        return res.status(400).json({ error: 'Aucun fichier uploadé' });
    }

    // Retourner l'URL du fichier
    const imageUrl = `/public/uploads/${req.file.filename}`;
    res.json({
        success: true,
        imageUrl: imageUrl,
        filename: req.file.filename
    });
});

module.exports = router;
