const pdfParser = require('pdf-parse');
const  { generateInterviewReport, generateResumePdf } = require('../services/ai.service');
const interviewReportModel = require("../models/interviewReport.model")
const generateInterviewController =async (req,res)=>{
    const resumeFile = req.file;

    const resumeContent= await (new pdfParser.PDFParse(Uint8Array.from(req.file.buffer))).getText()
    const {selfDescription,jobDescription}= req.body

    const interviewReportByAi = await generateInterviewReport({
        resume:resumeContent.text,
        selfDescription,
        jobDescription
    })
   
    const interviewReport = await interviewReportModel.create({
             user: req.user.id,
        resume:resumeContent.text,
        selfDescription,
        jobDescription,
        ...interviewReportByAi
    })

    res.status(201).json({
        message:"Report Generated Successfully",
        interviewReport
    })
}

const getInterviewReportByIdController= async(req,res)=>{
    const {interviewId} = req.params
   
    const interviewReport = await interviewReportModel.findOne({
        _id:interviewId , user:req.user.id
    })

    if(!interviewReport){
        return res.status(404).json({
            message:"Interview Report not found"
        })
    }

    res.status(200).json({
        message:"Interview Report fetched Successfully",
        interviewReport
    })
}
const getAllInterviewReportsController=async(req,res)=>{
    const interviewReports = await interviewReportModel
.find({ user: req.user.id })
.sort({ createdAt: -1 })
.select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

res.status(200).json({
    message:"Interview Reports fetched Successfully",
    interviewReports
})
}

const generateResumePdfController =async(req,res)=>{
    const {interviewReportId} = req.params;

    const interviewReport = await interviewReportModel.findById(interviewReportId);
    if(!interviewReport) {
        return res.status(404).json({
            message:"Interview Report Not Found"
        })
    }

    const {resume,jobDescription,selfDescription} = interviewReport

    const pdfBuffer = await generateResumePdf({resume,jobDescription,selfDescription})

    res.set({
        "Content-Type":"application/pdf",
        "Content-Disposition":`attachment; filename= resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
}
module.exports = {generateInterviewController,getInterviewReportByIdController,getAllInterviewReportsController,generateResumePdfController}