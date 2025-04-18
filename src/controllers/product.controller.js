const {
  createProduct,
  getAllProducts,
} = require("../services/Product.service");
const { successResponse, errorResponse } = require("../helpers/response");
const { createNotification } = require("../services/Notification.service");
class ProductController {
  createProduct = async (req, res) => {
    try {
      const { name, description, price, quantity, shopId } = req.body;
      const product = await createProduct({
        name,
        description,
        price,
        quantity,
        shopId,
      });
      if (product) {
        await createNotification({
          noti_type: "SHOP−001",
          noti_senderId: shopId,
          noti_receivedId: 1,
          noti_options: {
            productId: product._id,
            shopId,
          },
        })
          .then((noti) => {
            console.log("Notification created successfully", noti);
          })
          .catch((error) => {
            console.error("Error creating notification", error);
          });
      }
      if (!product) {
        return errorResponse(res, "Failed to create product");
      }
      return successResponse(res, "Product created successfully", product);
    } catch (error) {
      return errorResponse(res, "Failed to create product", error);
    }
  };
  getAllProducts = async (req, res) => {
    try {
      const { shopId } = req.query;
      const products = await getAllProducts({ shopId });
      return successResponse(res, "Products retrieved successfully", products);
    } catch (error) {
      return errorResponse(res, "Failed to retrieve products", error);
    }
  };
}
module.exports = new ProductController();
