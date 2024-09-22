const multer = require('multer');
const fs = require('fs');

const uploadDir = './uploads';

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const cleanFileName = file.originalname.replace(/[^\w.-]/g, '_');
    cb(null, `${Date.now()}-${cleanFileName}`);
  }
});

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//     cb(null, true);
//   } else {
//     cb(new Error('Only JPEG and PNG images are allowed'), false);
//   }
// };

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  //fileFilter: fileFilter
}).single('file');


const uploadMiddleware = (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: `Multer error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ message: `Upload error: ${err.message}` });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    next();
  });
};

module.exports = { uploadMiddleware };
