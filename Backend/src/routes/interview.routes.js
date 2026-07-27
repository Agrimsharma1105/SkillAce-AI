const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware")
const interviewRouter = express.Router();
const upload = require("../middlewares/file.middleware")
const interviewController = require("../controllers/interview.controller");
const aiRateLimiter = require("../middlewares/aiRateLimiter");

interviewRouter.post('/',authMiddleware.authUser, aiRateLimiter,upload.single("resume"),interviewController.generateInterviewController)

/**
 * @route GET /api/interview/:interviewId
 * @description get interview report by interviewId.
 * @access private
 */
interviewRouter.get("/report/:interviewId",authMiddleware.authUser,interviewController.getInterviewReportByIdController)

/**
 * @route GET /api/interview/
 * @description get all interview reports of logged in user.
 * @access private
 */
interviewRouter.get("/",authMiddleware.authUser,interviewController.getAllInterviewReportsController)

/**
 * @route GET /api/interview/resume/pdf
 * @description generate resume pdf on the basis of user self description, resume content and job description.
 * @access private
 */
interviewRouter.post("/resume/pdf/:interviewReportId", authMiddleware.authUser, interviewController.generateResumePdfController)
module.exports=interviewRouter