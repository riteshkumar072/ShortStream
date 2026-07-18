const express = require('express');
const shotHandler = require('../handler/shot.handler')
const authMiddleware = require("../middlewares/auth.middleware");
const restrictGuest = require("../middlewares/restrictGuest")
const multer = require('multer');


const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage()
})


router.post('/create', authMiddleware.authUserMiddleware, restrictGuest,upload.single("video"), shotHandler.createShot)

router.get('/',authMiddleware.authUserMiddleware, shotHandler.getShot)

router.post('/like',authMiddleware.authUserMiddleware,restrictGuest, shotHandler.likeShot)

router.post('/save',authMiddleware.authUserMiddleware, restrictGuest, shotHandler.saveShot)
router.get('/save', authMiddleware.authUserMiddleware, shotHandler.getSavedShot)

router.delete('/delete/:shotId', authMiddleware.authUserMiddleware, restrictGuest, shotHandler.deleteShot)

router.post('/comment',authMiddleware.authUserMiddleware, restrictGuest, shotHandler.createComment )
router.get('/comment/:shotId',authMiddleware.authUserMiddleware, shotHandler.getComment)

module.exports = router