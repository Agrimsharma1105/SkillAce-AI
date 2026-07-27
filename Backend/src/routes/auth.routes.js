const express = require("express");

const authRouter = express.Router();
const authController = require('../controllers/auth.controller')
const authMiddleware = require("../middlewares/auth.middleware");
const rateLimiter = require("../middlewares/rateLimiter");
/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
authRouter.post('/register',authController.registerUserController)
authRouter.post('/login',rateLimiter,authController.loginUserController)

/**
 * @route GET /api/auth/logout
 * @description clear token from user cookie and add the token in blacklist
 * @access public
 */

authRouter.get('/logout',authController.logoutUserController)

authRouter.get('/get-me',authMiddleware.authUser,authController.getMeController)

authRouter.post(
    "/save-api-key",
    authMiddleware.authUser,
    authController.saveApiKeyController
);


module.exports = authRouter
