const express = require("express");
const {
  calController,
} = require("../../controllers-typeorm/calculate.controller");

const router = express.Router();
//calculation
router.post("/calculation", calController);
// // user
// router.post("/user", createUserController);
// router.post("/user-faker", fakerDataInsert);
// // shop
// router.post("/shop", createShopController);
// router.post("/shop-faker", fakerDataShopInsert);
// router.get("/shop", getShopController);
// // product
// router.post("/product", createProductController);
// router.post("/product-faker", fakerDataproductInsert);
// // order
// router.post("/order", createOrderController);
// router.get("/order", getOrderController);
// router.post("/order-faker", fakerDataorderInsert);
module.exports = router;
