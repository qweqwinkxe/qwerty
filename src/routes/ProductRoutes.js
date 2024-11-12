const express = require('express');
const router = express.Router();
const productController = require('../controllers/ProductController');
const multer = require('multer');
const upload = multer();

router.get('/:id', productController.getProductById);
router.delete('/:id', productController.deleteProduct);
router.post('/', upload.single('photo'), productController.addProduct);

router.put('/:id', upload.single('photo'), productController.updateProduct);

module.exports = router;