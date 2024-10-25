const Order = require("../../models/orderModel")
const Admin = require("../../models/adminModel")

const loadDashboard = async (req, res) => {
    try {
        const admin = await Admin.findById(req.adminId);
        const today = new Date();

        // Calculate the start and end dates for this month
        const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const thisMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        // MongoDB aggregation pipeline to fetch the required data
        const pipeline = [
            {
                $match: {
                    orderDate: {
                        $gte: thisMonthStart,
                        $lte: thisMonthEnd,
                    },
                },
            },
            {
                $facet: {
                    todaysOrders: [
                        {
                            $match: {
                                orderDate: {
                                    $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
                                    $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
                                },
                            },
                        },
                        { $count: 'count' },
                    ],
                    thisMonthsOrders: [
                        { $count: 'count' },
                    ],
                    thisMonthsTotalRevenue: [
                        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
                    ],
                    totalCustomersThisMonth: [
                        {
                            $group: {
                                _id: '$user',
                            },
                        },
                        { $count: 'count' },
                    ],
                },
            },
        ];

        const pipelineDelivered = [
            {
                $match: {
                    status: {
                        $in: ["Delivered"]
                    },
                    orderDate: {
                        $gte: thisMonthStart,
                        $lte: thisMonthEnd,
                    },
                },
            },
            {
                $facet: {
                    todaysOrders: [
                        {
                            $match: {
                                orderDate: {
                                    $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
                                    $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
                                },
                            },
                        },
                        { $count: 'count' },
                    ],
                    thisMonthsOrders: [
                        { $count: 'count' },
                    ],
                    thisMonthsTotalRevenue: [
                        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
                    ],
                    totalCustomersThisMonth: [
                        {
                            $group: {
                                _id: '$user',
                            },
                        },
                        { $count: 'count' },
                    ],
                },
            },
        ];

        const order = await Order.aggregate(pipeline);
        const orderDelivered = await Order.aggregate(pipelineDelivered);

        let todaysOrders;
        let thisMonthsDeliveredOrders;
        let thisMonthsTotalRevenue;
        let totalCustomersThisMonth;

        order.forEach((ord) => {
            todaysOrders = ord.todaysOrders[0] ? ord.todaysOrders[0].count : 0;
            totalCustomersThisMonth = ord.totalCustomersThisMonth[0] ? ord.totalCustomersThisMonth[0].count : 0;
        });

        orderDelivered.forEach((ord) => {
            thisMonthsDeliveredOrders = ord.thisMonthsOrders[0] ? ord.thisMonthsOrders[0].count : 0;
            thisMonthsTotalRevenue = ord.thisMonthsTotalRevenue[0] ? ord.thisMonthsTotalRevenue[0].total : 0;
        })

        // for charts
        const orderChartData = await Order.find({ status: 'Delivered' });
        // Initialize objects to store payment method counts and monthly order counts
        const paymentMethods = {};
        const monthlyOrderCountsCurrentYear = {};

        // Get the current year
        const currentYear = new Date().getFullYear();

        // Iterate through each order
        orderChartData.forEach((order) => {
            // Extract payment method and order date from the order object
            let { paymentMethod, orderDate } = order;

            // Count payment methods
            if (paymentMethod) {
                switch (paymentMethod) {
                    case 'Cash on delivery': {
                        paymentMethod = 'cod';
                        break;
                    };
                    case 'Razorpay': {
                        paymentMethod = 'rzp';
                        break;
                    };
                }
                if (!paymentMethods[paymentMethod]) {
                    paymentMethods[paymentMethod] = order.totalAmount;
                } else {
                    paymentMethods[paymentMethod] += order.totalAmount;
                }
            }

            // Count orders by month
            if (orderDate) {
                const orderYear = orderDate.getFullYear();
                if (orderYear === currentYear) {
                    const orderMonth = orderDate.getMonth(); // Get the month (0-11)

                    // Create a unique key for the month
                    const monthKey = `${orderMonth}`; // Month is 0-based

                    if (!monthlyOrderCountsCurrentYear[monthKey]) {
                        monthlyOrderCountsCurrentYear[monthKey] = 1;
                    } else {
                        monthlyOrderCountsCurrentYear[monthKey]++;
                    }
                }
            }
        });

        const resultArray = new Array(12).fill(0);
        for (const key in monthlyOrderCountsCurrentYear) {
            const intValue = parseInt(key);
            resultArray[intValue] = monthlyOrderCountsCurrentYear[key];
        }

        return res.status(200).json({
            message: 'Success', data: {
                todaysOrders,
                thisMonthsDeliveredOrders,
                thisMonthsTotalRevenue,
                totalCustomersThisMonth,
                paymentMethods,
                monthlyOrderCountsCurrentYear: resultArray,
                admin
            }
        });

    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

const getData = async (req, res) => {
    try {
        const adminData = await Admin.findOne({ _id: req.adminId })

        return res.status(200).json({ message: 'Success', data: adminData });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

module.exports = {
    loadDashboard,
    getData,
}