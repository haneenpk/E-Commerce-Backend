const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const { v4 } = require('uuid');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

const upload = multer({ storage, fileFilter });

// Multer setup for product images
exports.uploadProductImages = upload.fields([
  { name: 'images', maxCount: 3 } // Allow up to 3 images
]);

exports.resizeProductImages = async (req, res, next) => {
  if (!req.files || !req.files.images) return next(); // Check if images exist

  req.body.images = []; // Initialize an array to store image filenames

  await Promise.all(
    req.files.images.map(async (file) => {
      const filename = `product-${v4()}.jpeg`;

      // Resize and save the image
      await sharp(file.buffer)
        .resize(640, 640) // Resize to 640x640
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(path.join(__dirname, '../public/products', filename));

      // Store the filename in req.body.images
      req.body.images.push(filename);
    })
  );

  next(); // Proceed to the next middleware
};
