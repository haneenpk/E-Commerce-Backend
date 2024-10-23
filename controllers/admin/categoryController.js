const Category = require("../../models/categoryModel")


const addCategory = async (req, res) => {
    try {

        if (!req.body.name) {
            return res.status(401).json({ message: 'Category name should be filled' });
        }

        const existingCategory = await Category.findOne({ name: { $regex: new RegExp(req.body.name, 'i') } });

        if (existingCategory) {
            return res.status(401).json({ message: 'This Category already exists' });
        }

        const category = await Category.create({
            name: req.body.name
        });

        if (category) {
            return res.status(200).json({ message: 'Success' });
        } else {
            return res.status(401).json({ message: 'Category has been failed' });
        }

    } catch (error) {
        // Catch any server errors and respond with an error message
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

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

const getCategory = async (req, res) => {
    try {

        const Categories = await Category.findOne({ _id: req.params.categoryId })

        if (!Categories) {
            return res.status(400).json({ message: 'Categories Empty' });
        }

        return res.status(200).json({ message: 'Success', data: Categories });

    } catch (error) {
        // Catch any server errors and respond with an error message
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

const deleteCategory = async (req, res) => {
    try {

        const Categories = await Category.deleteOne({ _id: req.params.categoryId })

        return res.status(200).json({ message: 'Success', data: Categories });

    } catch (error) {
        // Catch any server errors and respond with an error message
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

const editCategory = async (req, res) => {
    try {
        // Use $set to update the 'name' field
        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.categoryId,      // Find category by ID
            { $set: { name: req.body.name } },  // Set the new name
            { new: true }               // Return the updated document
        );

        // Check if category was found and updated
        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        return res.status(200).json({ message: 'Success', data: updatedCategory });

    } catch (error) {
        // Catch any server errors and respond with an error message
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

module.exports = {
    addCategory,
    loadCategory,
    deleteCategory,
    getCategory,
    editCategory,
}