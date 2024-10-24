const Category = require("../../models/categoryModel")
const Product = require("../../models/productModel")
const User = require("../../models/usersModel")

const loadProducts = async (req, res) => {
    try {
        const Products = await Product.find().populate('categoryId', 'name'); // Populate category name

        if (!Products) {
            return res.status(400).json({ message: 'Products Empty' });
        }

        return res.status(200).json({ message: 'Success', data: Products });

    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

const loadCategory = async (req, res) => {
    try {

        const Categories = await Category.find()

        if (!Categories) {
            return res.status(400).json({ message: 'Categories Empty' });
        }

        return res.status(200).json({ message: 'Success', data: Categories });

    } catch (error) {
        // Catch any server errors and respond with an error message
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

const getProduct = async (req, res) => {
    try {

        const userId = req.userId
        
        const productIdToCheck = req.params.productId;

        const check = await User.findOne(
            {
                _id: userId,
                cart: { $elemMatch: { product: productIdToCheck } },
            }
        )
        
        const productData = await Product.findById(productIdToCheck);

        if (check) {
            return res.status(200).json({ message: 'already exist', data: productData });
        } else {
            return res.status(200).json({ message: 'Success', data: productData });
        }

    } catch (error) {
        // Catch any server errors and respond with an error message
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}


module.exports = {
    loadProducts,
    loadCategory,
    getProduct,
}