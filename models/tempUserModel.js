const mongoose = require("mongoose");

const tempUsers = mongoose.Schema({
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
    otp: {
        type: Number,
        required: true
    },
    expireAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 1 // expires after 1 mins
    }
});

module.exports = mongoose.model("TempUsers", tempUsers);
