const express = require("express");
const adminRoute = express.Router(); // Fixed: should use `express.Router()` for routing
const bodyParser = require("body-parser");

const adminAuth = require("../middleware/adminAuth"); 
const Imagemiddleware = require('../middleware/imageUpload')

// Importing controllers
const loginController = require("../controllers/admin/loginController");
const categoryController = require("../controllers/admin/categoryController");
const productController = require("../controllers/admin/productController");

adminRoute.use(bodyParser.json());
adminRoute.use(bodyParser.urlencoded({ extended: true }));

// Define routes with proper controller methods
adminRoute.post("/login", loginController.verifyLogin);

// Category
adminRoute.post("/add-category", adminAuth, categoryController.addCategory);
adminRoute.get("/get-category", adminAuth, categoryController.loadCategory); 
adminRoute.get("/get-category/:categoryId", adminAuth, categoryController.getCategory); 
adminRoute.delete("/delete-catagory/:categoryId", adminAuth, categoryController.deleteCategory); 
adminRoute.put("/edit-category/:categoryId", adminAuth, categoryController.editCategory);

// Product
adminRoute.post("/add-product", adminAuth, Imagemiddleware.uploadProductImages, Imagemiddleware.resizeProductImages ,productController.addProduct);
adminRoute.get("/get-products", adminAuth, productController.loadProducts);

// 404 handler for invalid requests
adminRoute.use((req, res) => {
    return res.status(404).json({ message: 'Invalid request admin' });
});

module.exports = adminRoute;
