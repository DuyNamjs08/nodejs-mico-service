const express = require('express');
const productsController = require('../../controllers/product.controller');
const router = express.Router();

router.post('/products', productsController.createProduct);
router.get('/products', productsController.getAllProducts);

module.exports = router;
