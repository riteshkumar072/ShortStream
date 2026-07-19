const userModel = require('../models/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

async function registerUser(req, res) {
    let { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ success: false });
    }

    name = name.trim();
    email = email.trim();

    if (name.length > 30) {
        return res.status(400).json({ success: false });
    }

    const isUserAlreadyExists = await userModel.findOne({ email })

    if (isUserAlreadyExists) {
        return res.status(400).json({
            message: "User already exists"
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        name,
        email,
        password: hashedPassword
    })


    const token = jwt.sign({
        id: user._id,
    }, process.env.JWT_SECRET)

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.status(201).json({
        success: true,
        message: "User registerd successfully",
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
        }
    })
}



async function loginUser(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const token = jwt.sign({
        id: user._id,
    }, process.env.JWT_SECRET)

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.status(200).json({
        message: "user logged successfully",
        user: {
            _id: user._id,
            email: user.email,
            name: user.name,
            about: user.about,
            profileImage: user.profileImage
        }
    })
}



async function getMe(req, res) {
    const user = await userModel.findById(req.user._id).select("-password -phone -email")
    if (!user) {
        return res.status(404).json({
            message: "User not found",
        });
    }
    res.status(200).json({
        message: "Current user fetched successfully",
        user,
    });
}


async function logoutUser(req, res) {
    res.clearCookie("token");
    res.status(200).json({
        message: "User logout successfully"
    })
}


const GUEST_ID = "660000000000000000000000";
async function guestLogin(req, res) {
    try {
        const guestToken = jwt.sign(
            { _id: GUEST_ID, role: "guest" },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        )
        res.cookie("token", guestToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        });
        return res.status(200).json({
            success: true,
            user: { _id: GUEST_ID, name: "Guest User", about: "Exploring the app" }
        })

    } catch (error) {

    }

}

module.exports = { registerUser, loginUser, logoutUser, getMe, guestLogin }