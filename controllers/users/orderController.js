const mongoose = require('mongoose');
const Product = require("../../models/productModel")
const User = require("../../models/usersModel")
const Order = require("../../models/orderModel")
const Address = require("../../models/addressModel")

const orderProduct = async (req, res) => {

    try {

        const selectedPaymentOptions = req.body.selectedPayment;

        console.log(selectedPaymentOptions);

        if (selectedPaymentOptions) {

            const userData = await User.findById(req.userId).populate('cart.product');

            const selectAddress = await Address.findOne({ userId: req.userId, default: true })

            console.log(selectAddress);

            if (selectAddress) {

                const products = userData.cart.map((cartItem) => {
                    return {
                        product: cartItem.product, // Product reference
                        quantity: cartItem.quantity, // Quantity
                        total: cartItem.total,
                    };
                });

                const order = new Order({
                    user: req.userId,
                    products: products,
                    totalAmount: userData.totalCartAmount,
                    paymentMethod: selectedPaymentOptions,
                    deliveryAddress: {
                        _id: selectAddress._id,
                        userId: userData._id,
                        name: selectAddress.name,
                        mobile: selectAddress.mobile,
                        country: selectAddress.country,
                        state: selectAddress.state,
                        district: selectAddress.district,
                        city: selectAddress.city,
                        pincode: selectAddress.pincode,
                        address: selectAddress.address
                    }
                });

                await order.save()

                // stock update
                for (let i = 0; i < userData.cart.length; i++) {

                    const changeStock = await Product.findById(userData.cart[i].product)

                    await Product.updateOne({ _id: changeStock._id }, { stock: changeStock.stock - userData.cart[i].quantity })

                }

                userData.cart = [];
                userData.totalCartAmount = 0;

                await userData.save();

                return res.status(200).json({ message: 'Success' });

            } else {
                const errorMessage = "Please select delivery address";
                return res.status(401).json({ message: errorMessage });
            }

        } else {
            const errorMessage = "Please select any payment option";
            return res.status(401).json({ message: errorMessage });
        }

    } catch (error) {
        // Catch any server errors and respond with an error message
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

const loadOrder = async (req, res) => {
    try {

        const orders = await Order.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(req.userId) } },
            { $unwind: "$products" },
            {
                $lookup: {
                    from: "products",
                    localField: "products.product",
                    foreignField: "_id",
                    as: "orderedProducts"
                }
            },
            { $sort: { orderDate: -1 } },
        ]);

        return res.status(200).json({ message: 'Success', orders });
    } catch (error) {
        // Catch any server errors and respond with an error message
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}


module.exports = {
    orderProduct,
    loadOrder,
}