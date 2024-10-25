const Order = require("../../models/orderModel")

const loadOrder = async (req, res) => {
    try {
        let ordersQuery = Order.find().populate([{ path: 'products.product' }, { path: 'user' }])

        const orders = await ordersQuery
            .sort({ orderDate: -1 }) // Sort by orderDate in descending order

        return res.status(200).json({ message: 'Success', data: orders });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

const updateActionOrder = async (req, res) => {
    try {

        await Order.updateOne({ _id: req.query.orderId }, { status: req.query.action })

        return res.status(200).json({ message: 'Success' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

module.exports = {
    loadOrder,
    updateActionOrder,
}