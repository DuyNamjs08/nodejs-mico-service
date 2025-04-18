const ProductModel = require('../models/Product.model');
const createProduct = async (data) => {
  const { name, description, price, quantity, shopId } = data;
  const product = await ProductModel.create({
    name,
    description,
    price,
    quantity,
    shopId,
  });
  return product.save();
};
const getAllProducts = async (data) => {
  const { shopId } = data;
  const product = await ProductModel.find({
    shopId,
  });
  return product;
};
module.exports = {
  createProduct,
  getAllProducts,
};
