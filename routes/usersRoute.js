const express = require("express")
const usersRoute = express()

// const auth = require("../middleware/auth")

// const middlewares = require('../middleware/imageUpload')

const bodyParser = require("body-parser")

usersRoute.use(bodyParser.json())
usersRoute.use(bodyParser.urlencoded({ extended: true }))

// controllers require
// const mainController = require("../controllers/users/mainController")
const loginSignupController = require("../controllers/users/login&signupController")
// const profileController = require("../controllers/users/profileController")
// const cartCheckoutController = require("../controllers/users/cart&checkoutController")
// const orderController = require("../controllers/users/orderController")


// usersRoute.get("/", mainController.loadHome)

// usersRoute.get("/home", mainController.loadHome)

// usersRoute.get("/shop", mainController.loadShop)

// usersRoute.get("/productDetail", mainController.loadProductDetail)

// signup , otp , login

usersRoute.post("/register", loginSignupController.insertUsers)
usersRoute.post("/validateOtp", loginSignupController.verifiyOTP)
usersRoute.post("/login", loginSignupController.verifyLogin)

// usersRoute.post("/verifyOTP", loginSignupController.verifyOTPSignup)

// usersRoute.post("/login", loginSignupController.verifyLogin)

// profile

// usersRoute.get("/profile", auth.isLogin, profileController.loadProfile)

// usersRoute.post("/edit-profile", auth.isLogin, profileController.EditProfile)

// change password

// usersRoute.get("/change-password", auth.isLogin, profileController.loadChangePass)

// usersRoute.post("/change-password", auth.isLogin, profileController.ChangePass)


// Address

// usersRoute.get("/add-address", auth.isLogin, profileController.loadAddAddress)

// usersRoute.post("/add-address", auth.isLogin, profileController.AddAddress)

// usersRoute.get("/delete-address", auth.isLogin, profileController.deleteAddress)

// usersRoute.post("/edit-address", auth.isLogin, profileController.EditAddress)

// Whishlist

// usersRoute.get("/addWhishlist", auth.isLogin, mainController.addToWhishlist)

// usersRoute.get("/wishlist", auth.isLogin, mainController.loadWishlist)

// usersRoute.get("/delete-whishlist", auth.isLogin, mainController.deleteWhishlist)

// Cart

// usersRoute.get("/addToCart", auth.isLogin, cartCheckoutController.addToCart)

// usersRoute.post("/update-cart/:id", auth.isLogin, cartCheckoutController.updateCart)

// usersRoute.get("/shopingCart", auth.isLogin, cartCheckoutController.loadShopingCart)

// usersRoute.get("/delete-cart", auth.isLogin, cartCheckoutController.deleteCart)

// Checkout

// usersRoute.get("/checkout", auth.isLogin, cartCheckoutController.loadCheckout)

// usersRoute.get("/edit-address-checkout", auth.isLogin, cartCheckoutController.loadEditAddressCheckout)

// usersRoute.post("/edit-address-checkout", auth.isLogin, cartCheckoutController.EditAddressCheckout)

// usersRoute.get("/add-address-checkout", auth.isLogin, cartCheckoutController.loadAddAddressCheckout)

// usersRoute.post("/add-address-checkout", auth.isLogin, cartCheckoutController.AddAddressCheckout)

// usersRoute.get("/select-address", auth.isLogin, cartCheckoutController.selectAddress)

// Order

// usersRoute.post("/order-product", auth.isLogin, orderController.orderProduct)

// usersRoute.post("/save-rzporder", auth.isLogin, orderController.saveRzpOrder)

// usersRoute.get("/order", auth.isLogin, orderController.loadOrder)

// usersRoute.get("/return-product", auth.isLogin, orderController.getReturnProductForm)

// usersRoute.post("/return-product", auth.isLogin, orderController.requestReturnProduct)


// Review

// usersRoute.post("/submitReview", auth.isLogin, orderController.submitReview)



usersRoute.use((req, res) => {
    return res.status(404).json({ message: 'Invalid request' });
})

module.exports = usersRoute;