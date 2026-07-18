const express = require('express')
const authMiddleware = require("../middlewares/auth.middleware");
const restrictGuest = require("../middlewares/restrictGuest");
const userHandler = require("../handler/user.handler");
const { uploadFile } = require('../services/storage.service');
const multer = require('multer');


const router = express.Router();
const upload = multer({
    storage: multer.memoryStorage()
})

//logged user data for logged user
router.get("/myprofile",authMiddleware.authUserMiddleware, userHandler.getMyProfile)

//other user data for logged user
router.get("/:id", authMiddleware.authUserMiddleware, userHandler.getUserById)

router.put("/edit-profile",authMiddleware.authUserMiddleware, restrictGuest, upload.single("image"), userHandler.editProfile)

module.exports = router;