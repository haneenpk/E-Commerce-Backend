const mongoose = require("mongoose");

const users = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profile: {
        type: String,
        default: ''
    },
    cart: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            },
            quantity: {
                type: Number,
                default: 1
            },
            total: {
                type: Number,
                default: 0
            }
        }
    ],
    totalCartAmount: {
        type: Number,
        default: 0
    },
    wishlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    ],
});

module.exports = mongoose.model("User", users);
