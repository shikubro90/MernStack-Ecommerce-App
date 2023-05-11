const express = require("express");
const router = express.Router();
const formidable = require("express-formidable");

const { requireSignIn, isAdmin } = require("../middlewares/auth");

const {
  createProduct,
  list,
  read,
  photo,
  remove,
  update,
  filterProducts,
  countProdcuts,
  productList,
  productsSearch,
  relatedProducts,
  processpayment,
  orderStatus,
  allOrder,
  getToken
} = require("../controllers/products");

router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProduct
);
router.get("/products", list);
router.get("/products/:slug", read);
router.get("/product/photo/:productId", photo);
router.delete("/product/:productId", requireSignIn, isAdmin, remove);
router.put("/product/:productId", requireSignIn, isAdmin, formidable(), update);
router.post("/filter-product", filterProducts);
router.get("/count-product", countProdcuts);
router.get("/list-product/:page", productList);
router.get("/related-products/:productId/:categoryId", relatedProducts)
router.post("/search-products/:keyword", productsSearch);

// check out
router.get("/braintree/token", getToken)
router.post("/braintree/payment", requireSignIn, processpayment);
router.put("/order-status/:orderId", requireSignIn, isAdmin, orderStatus)
router.get("/all-order", allOrder)

module.exports = router;
