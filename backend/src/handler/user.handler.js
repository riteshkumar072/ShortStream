const { attachUserInteractions } = require("../utils/videoHelper");
const shotModel = require("../models/shot.model");
const userModel = require("../models/user.model");
const storageService = require("../services/storage.service");


async function getUserById(req, res) {
    try {
        
        const userId = req.params.id;
        const loggedInUserId = req.user?._id;
        const user = await userModel.findById(userId).select('-password -email -phone').lean();
        
        if (!user) {
            return res.status(401).json({ message: "User not found" })
        }
        
        const itemByUser = await shotModel.find({ createdBy: userId }).sort({ createdAt: -1 }).lean()

        const updatedShots = await attachUserInteractions(itemByUser, loggedInUserId)

        res.status(200).json({
            message: "User retrieved successfully",
            user: {
                ...user,
                itemByUser: updatedShots
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message })
    }
}


async function getMyProfile(req, res) {
    try {
        const userId = req.user._id

        //guest
        if (userId === "660000000000000000000000") {
            return res.status(200).json({
                success: true,
                user: {
                    _id: "660000000000000000000000",
                    name: "Guest User",
                    about: "Exploring the app as a guest!",
                    myItem: []
                }
            });
        }


        const user = await userModel.findById(userId).select('-password').lean();
        
        if (!user) {
            return res.status(401).json({ message: "User not found" })
        }

        const myItem = await shotModel.find({ createdBy: userId }).sort({ createdAt: -1 }).lean()

        const updatedShots = await attachUserInteractions(myItem,userId)

        res.status(200).json({
            message: "Your profile fetched successfully",
            user: {
                ...user,
                myItem: updatedShots
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message })
    }
}


async function editProfile(req,res) {

    try {
        const userId = req.user._id
        let {about, name} = req.body;

        const  updateData = {}

        if(name !== undefined){
            name = name.trim();
            if(!name || name.length > 30){
                return res.status(400).json({
                    success: false
                })
            }
            updateData.name = name
        }

        if(about != undefined){
            about = about.trim();
            if(about.length > 150){
                return res.status(400).json({success: false})
            }
            updateData.about = about
        }
        if(req.file){
            const fileUploadResult = await storageService.uploadFile(req.file.buffer.toString('base64'), req.file.originalname)
            updateData.profileImage = fileUploadResult.url
        }

        const updatedUserData = await userModel.findByIdAndUpdate(userId,
            { $set: updateData }, 
            { new: true }
        ).select('-password -phone -email')

        res.status(200).json({ 
            success: true,
            updatedUserData
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error", error: error.message})
    }
}

module.exports = { getUserById, getMyProfile , editProfile}