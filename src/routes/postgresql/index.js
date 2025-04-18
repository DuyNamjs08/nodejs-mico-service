const express = require('express');
const {
  createUserController,
  fakerDataInsert,
} = require('../../controllers-postgresql/user.controller');
const {
  createShopController,
  fakerDataShopInsert,
  getShopController,
} = require('../../controllers-postgresql/shop.controller');
const {
  createProductController,
  fakerDataproductInsert,
} = require('../../controllers-postgresql/product.controller');
const {
  createOrderController,
  fakerDataorderInsert,
  getOrderController,
} = require('../../controllers-postgresql/order.controller');

const router = express.Router();
// user
router.post('/user', createUserController);
router.post('/user-faker', fakerDataInsert);
// shop
router.post('/shop', createShopController);
router.post('/shop-faker', fakerDataShopInsert);
router.get('/shop', getShopController);
// product
router.post('/product', createProductController);
router.post('/product-faker', fakerDataproductInsert);
// order
router.post('/order', createOrderController);
router.get('/order', getOrderController);
router.post('/order-faker', fakerDataorderInsert);
module.exports = router;
