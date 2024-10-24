const express = require("express")
const usersRoute = express()

// const auth = require("../middleware/auth")

// const middlewares = require('../middleware/imageUpload')

const bodyParser = require("body-parser")

usersRoute.use(bodyParser.json())
usersRoute.use(bodyParser.urlencoded({ extended: true }))

// controllers require
const mainController = require("../controllers/users/mainController")
const loginSignupController = require("../controllers/users/login&signupController")


usersRoute.get("/get-category", mainController.loadCategory)

usersRoute.get("/get-products", mainController.loadProducts)

usersRoute.get("/get-product/:productId", mainController.getProduct)


// signup , otp , login

usersRoute.post("/register", loginSignupController.insertUsers)
usersRoute.post("/validateOtp", loginSignupController.verifiyOTP)
usersRoute.post("/login", loginSignupController.verifyLogin)


usersRoute.use((req, res) => {
    return res.status(404).json({ message: 'Invalid request' });
})

module.exports = usersRoute;