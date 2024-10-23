const User = require("../../models/usersModel")
const TempUser = require("../../models/tempUserModel")

const bcrypt = require("bcrypt")
const nodemailer = require("nodemailer")
const jwt = require('jsonwebtoken');

const securePassword = async (password) => {

    try {

        const passwordHash = await bcrypt.hash(password, 10)
        return passwordHash;

    } catch (error) {
        res.status(400).json({ message: error });
    }

}

const insertUsers = async (req, res) => {

    try {
        const { username, email, mobile, password } = req.body
        console.log(req.body);

        const isUsernameExist = await User.findOne({ username })
        const isEmailExist = await User.findOne({ email })

        if (isUsernameExist === null) {
            if (isEmailExist === null) {
                const OTP = Math.floor(1000 + Math.random() * 9000)

                const spassword = await securePassword(password)

                await TempUser.deleteOne({ email })

                const user = new TempUser({
                    username: username,
                    email: email,
                    mobile: mobile,
                    password: spassword,
                    otp: OTP
                });

                user
                    .save()
                    .then((result) => {
                        // sendVerificationEmail(result, res)
                        sendOTPVerificationEmail(result, res)
                    })
                    .catch((err) => {
                        console.log(err);
                        res.status(400).json({ message: "An error occur while saving process" })
                    })

                // console.log('responding with 200');
                res.status(200).json({ message: 'Success' })
            } else {
                res.status(403).json({ message: "Email already Exist" });
            }
        } else {
            res.status(403).json({ message: "Username already Exist" });
        }

    } catch (error) {
        console.log(error);
        console.log('error while register');
    }

}

// Nodemailer stuff
let transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
    },
})

const sendOTPVerificationEmail = async ({ _id, email, otp }, res) => {
    try {

        // mail options
        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: "Verify Your Email",
            html: `<p>Enter <b>${otp}</b> in the app verify your email address and complete the signup process</p>
            <p>This code <b>expire in 1 minutes</b>.</p>`,
        }

        await transporter.sendMail(mailOptions)

    } catch (error) {
        res.status(500).json({ message: "Email sending problem" });
    }
}

//Validate OTP 
const verifiyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body

        const tempUser = await TempUser.findOne({ email })

        console.log("got user", tempUser);

        if (tempUser) {
            if (otp == tempUser.otp) {
                const user = new User({
                    username: tempUser.username, // Change to tempUser.username
                    email: tempUser.email, // Use tempUser's email
                    mobile: tempUser.mobile, // Use tempUser's mobile
                    password: tempUser.password, // Use tempUser's hashed password
                });

                await user.save(); // Make sure to await the save

                // Delete the temporary user after successful verification
                await TempUser.deleteOne({ email });

                res.status(200).json({
                    status: 200,
                    data: user,
                    message: 'Success',
                });
            } else {
                res.status(401).json({ message: 'Invalid OTP' });
            }
        } else {
            res.status(401).json({ message: 'Timeout, Register again' });
        }

    } catch (error) {
        // Send error as JSON instead of rendering
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};


const verifyLogin = async (req, res) => {

    try {

        const { email, password } = req.body

        const userData = await User.findOne({ email: email })
        if (userData !== null) {
            const passwordMatch = await bcrypt.compare(password, userData.password)
            if (passwordMatch) {

                // Create a JWT token when the password is correct
                const jwtToken = jwt.sign(
                    { id: userData._id, email: userData.email },  // Payload data (user ID and email)
                    process.env.JWT_SECRET,                       // Secret key (stored in .env)
                    { expiresIn: '1d' }                           // Token expiration set to 1 day
                );

                return res.status(200).json({ message: 'Success', data: userData, jwtToken });

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
    insertUsers,
    verifiyOTP,
    verifyLogin,
}