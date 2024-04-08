const multer = require('multer');

// Set up the multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); 
  },
  filename: (req, file, cb) => {
    const exten = file.originalname.split('.')[1];
    const fileName = `${Date.now()}.${exten}`;
    req.imageUrl = fileName;
    cb(null, fileName);
  },
});
  
// Create the multer instance
const upload = multer({ storage });

module.exports = upload;