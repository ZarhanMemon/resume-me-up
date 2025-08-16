import multer from 'multer';

// Storage config: controls *where* and *how* files are saved
const storage = multer.diskStorage({
  // Destination folder for uploads
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files inside /uploads directory
  },

  // File naming strategy to avoid overwriting existing files
  filename: (req, file, cb) => {  
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

// File filter: restrict uploads to specific image formats
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);  // Accept file
    } else {
        cb(new Error("Invalid image type"), false); // Reject file
    }
};

// Multer instance: handles multipart/form-data for file uploads
const upload = multer({
    storage, // Custom storage config
    limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB
    fileFilter // Apply file type restrictions
});

export default upload;
