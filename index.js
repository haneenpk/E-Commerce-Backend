require('dotenv').config();
const mongoose = require("mongoose")
const cors = require('cors')
const express = require("express")

const app = express()

mongoose.connect(process.env.MONGODB_URI);

app.use(express.static("public"))

app.use(cors({
    credentials: true,
    origin: process.env.CORS_URI
}))

//for admin routes
const adminRoute = require("./routes/adminRoute")
app.use("/api/admin",adminRoute)

//for user routes
const usersRoute = require("./routes/usersRoute")
app.use("/api/user",usersRoute)

const PORT = process.env.PORT

app.listen(PORT,() => console.log(`Server Running on port ${PORT}...`));