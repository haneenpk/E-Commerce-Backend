const mongoose = require("mongoose")

const products = mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    price:{
        type:Number,
        require:true
    },
    description:{
        type:String,
        require:true
    },
    stock:{
        type:Number,
        require:true
    },
    brand: {
        type: String,
        require:true
    },
    images:[String], 
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
});

module.exports = mongoose.model("Product",products);