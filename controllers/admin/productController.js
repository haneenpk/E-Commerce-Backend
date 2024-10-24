const Product = require("../../models/productModel")

const addProduct = async (req, res) => {
    try {

        if (!req.body.name) {
            return res.status(401).json({ message: 'Product name should be filled' });
        }

        const existingProduct = await Product.findOne({ name: req.body.name })

        if (existingProduct) return res.status(401).json({ message: 'Product name already existed' })

        if (!req.body.price) {
            return res.status(401).json({ message: 'Price should be filled' });
        }

        if (!req.body.description) {
            return res.status(401).json({ message: 'Description should be filled' });
        }

        const imagesWithPath = req.body.images.map(img => '/products/' + img)

        const productData = new Product({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            stock: req.body.stock,
            brand: req.body.brand,
            categoryId: req.body.categoryId, // Category ID from the form
            images: imagesWithPath,
        })

        await productData.save()

        if (productData) {
            return res.status(200).json({ message: 'Product added' });
        } else {
            return res.status(401).json({ message: 'Product not added try again' });
        }


    } catch (error) {
        // Catch any server errors and respond with an error message
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

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

module.exports = {
    addProduct,
    loadProducts,
}