const express = require('express');
const authHandler = require('../handler/auth.handler');
const AuthMiddleware = require('../middlewares/auth.middleware')

const router = express.Router();


router.post('/register',authHandler.registerUser)
router.post('/login',authHandler.loginUser)
router.get('/logout', authHandler.logoutUser)
router.get('/me',AuthMiddleware.authUserMiddleware, authHandler.getMe)
router.post('/guest', authHandler.guestLogin)

module.exports = router;