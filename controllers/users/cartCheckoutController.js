const mongoose = require('mongoose');
const User = require("../../models/usersModel")
const Product = require("../../models/productModel")
const Address = require("../../models/addressModel")

const addToCart = async (req, res) => {

    try {

        const productId = req.params.productId

        const productData = await Product.findById(productId)
        const obj = {
            product: productData._id,
            quantity: 1,
            total: productData.price
        }

        const userData = await User.findById(req.userId)

        const totalCartAmt = userData.totalCartAmount + productData.price

        const nweee = await User.updateOne({ _id: req.userId }, { $set: { totalCartAmount: totalCartAmt } })

        userData.cart.push(obj);
        await userData.save()

        return res.status(200).json({ message: 'Added Success' });

    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

const loadCart = async (req, res) => {

    try {

        const userData = await User.findById(req.userId).populate('cart.product');

        return res.status(200).json({ message: 'Success', data: userData });

    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }

};


const updateCart = async (req, res) => {
    try {
        // Find user and populate cart products in one query
        const currentUser = await User.findById(req.userId).populate('cart.product');
        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find the cart item
        const cartItemIndex = currentUser.cart.findIndex(item =>
            item.product._id.equals(new mongoose.Types.ObjectId(req.params.productId))
        );

        if (cartItemIndex === -1) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        const cartItem = currentUser.cart[cartItemIndex];
        const product = cartItem.product;

        // Update quantity based on action type
        if (req.body.type === "increment") {
            if (cartItem.quantity + 1 > product.stock) {
                return res.status(400).json({
                    message: "Stock limit exceeded",
                    data: {
                        cart: currentUser.cart,
                        totalCartAmount: currentUser.totalCartAmount
                    }
                });
            }
            cartItem.quantity++;
        } else if (req.body.type === "decrement") {
            if (cartItem.quantity > 1) {
                cartItem.quantity--;
            } else {
                return res.status(400).json({
                    message: "Quantity cannot be less than 1",
                    data: {
                        cart: currentUser.cart,
                        totalCartAmount: currentUser.totalCartAmount
                    }
                });
            }
        }

        // Update item total
        cartItem.total = cartItem.quantity * product.price;

        // Recalculate cart total
        currentUser.totalCartAmount = currentUser.cart.reduce((total, item) => {
            return total + (item.quantity * item.product.price);
        }, 0);

        // Save changes
        await currentUser.save();

        // Return updated cart data
        return res.status(200).json({
            message: "Cart updated successfully",
            data: {
                cart: currentUser.cart,
                totalCartAmount: currentUser.totalCartAmount
            }
        });

    } catch (error) {
        console.error("Update cart error:", error);
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

const deleteCart = async (req, res) => {

    try {

        const userData = await User.findById(req.userId)

        const cartId = req.query.cartId

        const itemIndex = userData.cart.findIndex(item => item._id.toString() === cartId);

        userData.totalCartAmount -= userData.cart[itemIndex].total

        userData.cart.splice(itemIndex, 1);
        await userData.save();

        return res.status(200).json({ message: 'Success' });

    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }

}

const loadCheckout = async (req, res) => {

    try {

        const userData = await User.findById(req.userId).populate('cart.product');

        const selectAddress = await Address.findOne({ userId: req.userId, default: true })

        const allAddress = await Address.find({ userId: req.userId, default: false })

        return res.status(200).json({
            message: "Success",
            data: {
                user: userData,
                selectAddress,
                allAddress
            }
        });

    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }

}

const AddAddressCheckout = async (req, res) => {

    try {
        const { name, mobile, country, state, district, city, pincode, address } = req.body
        console.log(req.body);


        // Validate mobile (10 digits)
        if (!/^\d{10}$/.test(mobile)) {
            return res.status(401).json({ message: 'Mobile number should be 10 digits.' }); return res.render("users/addAdress", { activePage: "shopingCart", user: req.session.user_id, error: "Mobile number should be 10 digits." })
        }

        const check = await Address.find({ userId: req.userId })

        console.log(check, "check");


        if (check.length > 0) {
            const addAddress = new Address({
                userId: req.userId, name, mobile, country, state, district, city, pincode, address
            });
            addAddress.save()
        } else {
            const addAddress = new Address({
                userId: req.userId, name, mobile, country, state, district, city, pincode, address, default: true
            });
            addAddress.save()
        }

        return res.status(200).json({ message: 'Success' });

    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

const selectAddress = async (req, res) => {

    try {

        await Address.updateOne({ userId: req.userId, default: true }, { default: false })

        await Address.updateOne({ _id: req.query.id }, { default: true })

        return res.status(200).json({ message: 'Success' });

    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

module.exports = {
    addToCart,
    loadCart,
    updateCart,
    deleteCart,
    loadCheckout,
    AddAddressCheckout,
    selectAddress,
}