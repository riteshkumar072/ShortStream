const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');




async function authUserMiddleware(req, res, next) {
        console.log("===== AUTH MIDDLEWARE =====");
    console.log("Cookies:", req.cookies);
    console.log("Token:", req.cookies?.token);
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "Please login first"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)


        //guest-login
        const GUEST_ID = "660000000000000000000000";
        if(decoded._id === GUEST_ID){
            req.user = {_id: GUEST_ID, role: "guest"}
            return next();
        }

        const user = await userModel.findById(decoded.id)
        if (!user) {
            return res.status(401).json({ message: "User not exists" });
        }
        req.user = user
        req.user.role = "user";
        next();

    } catch (error) {
        return res.status(401).json({
            message: "Please login first"
        })
    }
}

module.exports = { authUserMiddleware }