const User = require("../../models/usersModel")

const loadProfile = async (req, res) => {

    try {
        const userProfile = await User.findById(req.userId)

        return res.status(200).json({ message: 'Success', data: userProfile });

    } catch (error) {
        // Catch any server errors and respond with an error message
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

module.exports = {
    loadProfile,
}