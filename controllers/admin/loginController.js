const Admin = require("../../models/adminModel")

const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');


const verifyLogin = async (req, res) => {

    try {

        const { email, password } = req.body

        console.log(req.body);
        
        const adminData = await Admin.findOne({ email: email })
        if (adminData !== null) {
            const passwordMatch = await bcrypt.compare(password, adminData.password)
            if (passwordMatch) {

                // Create a JWT token when the password is correct
                const jwtToken = jwt.sign(
                    { id: adminData._id, email: adminData.email },  // Payload data (user ID and email)
                    process.env.JWT_SECRET,                       // Secret key (stored in .env)
                    { expiresIn: '1d' }                           // Token expiration set to 1 day
                );

                return res.status(200).json({ message: 'Success', data: adminData, jwtToken });

            } else {
                return res.status(401).json({ message: 'Incorrect Password' });
            }
        }

        return res.status(401).json({ message: 'Invalid email or password!' });

    } catch (error) {
        // Catch any server errors and respond with an error message
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

module.exports = {
    verifyLogin,
}