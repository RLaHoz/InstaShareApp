const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const multer = require('multer');
const authMiddleware = require('../middleware/authMiddleware');
const fileMiddleware = require('../middleware/fileMiddleware');

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

router.post('/upload', authMiddleware.auth, fileMiddleware.uploadMiddleware, fileController.uploadFile);
router.get('/download/:id', authMiddleware.auth, fileController.downloadCompressedFile);
router.delete('/delete/:id', authMiddleware.auth, fileController.deleteFile);
router.get('/user-files', authMiddleware.auth, fileController.getAllUserFiles);
// Ruta para obtener el estado del archivo
router.get('/status/:id', authMiddleware.auth, fileController.checkStatus);

module.exports = router;
