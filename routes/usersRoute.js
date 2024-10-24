const express = require("express")
const usersRoute = express()

const userAuth = require("../middleware/userAuth")

const bodyParser = require("body-parser")

usersRoute.use(bodyParser.json())
usersRoute.use(bodyParser.urlencoded({ extended: true }))

// controllers require
const mainController = require("../controllers/users/mainController")
const loginSignupController = require("../controllers/users/login&signupController")
const cartCheckoutController = require("../controllers/users/cartCheckoutController")
const orderController = require("../controllers/users/orderController")

// Common
usersRoute.get("/get-category", mainController.loadCategory)
usersRoute.get("/get-products", mainController.loadProducts)
usersRoute.get("/get-product/:productId", mainController.getProduct)


// signup , otp , login
usersRoute.post("/register", loginSignupController.insertUsers)
usersRoute.post("/validateOtp", loginSignupController.verifiyOTP)
usersRoute.post("/login", loginSignupController.verifyLogin)


// Cart
usersRoute.get("/add-cart/:productId", userAuth, cartCheckoutController.addToCart)
usersRoute.get("/loadCart", userAuth, cartCheckoutController.loadCart)
usersRoute.post("/update-cart/:productId", userAuth, cartCheckoutController.updateCart)
usersRoute.get("/delete-cart", userAuth, cartCheckoutController.deleteCart)


// Checkout
usersRoute.get("/loadCheckout", userAuth, cartCheckoutController.loadCheckout)
usersRoute.post("/add-address-checkout", userAuth, cartCheckoutController.AddAddressCheckout)
usersRoute.get("/select-address", userAuth, cartCheckoutController.selectAddress)


// Order
usersRoute.post("/order-product", userAuth, orderController.orderProduct)
usersRoute.get("/order", userAuth, orderController.loadOrder)

usersRoute.use((req, res) => {
    return res.status(404).json({ message: 'Invalid request' });
})

module.exports = usersRoute;