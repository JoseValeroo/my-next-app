const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Ruta ABSOLUTA (cámbiala según tu sistema)
    const uploadPath = "public/uploads/"; // 👈 Carpeta de subida
    
    console.log("📁 Ruta de subida:", uploadPath); // 👈 Para debuggear
    
     if (!fs.existsSync(uploadPath)) {
       fs.mkdirSync(uploadPath, { recursive: true });
     }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { 
    fileSize: 100 * 1024 * 1024, // 100MB
    files: 4 // Máximo 4 archivos
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|mp4|mov|avi|webm|mkv|pdf/; // Formatos permitidos
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes (JPEG, PNG), videos (MP4, MOV, AVI) y PDFs'));
    }
  }
}).array('media', 4); // Hasta 4 archivos

module.exports = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      console.error("❌ Error en Multer:", err); 
      return res.status(400).json({ message: err.message });
    }
    
    console.log("✅ Archivos subidos:", req.files); // 👈 Ver archivos
    next();
  });
};