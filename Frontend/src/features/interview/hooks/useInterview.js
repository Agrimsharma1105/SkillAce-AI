import {generateInterviewReport,getInterviewReportById,getAllInterviewReports,generateResumePdf} from '../services/interview.api'
import {useContext,useEffect} from 'react'
import { InterviewContext } from '../interview.context'
import { useParams } from "react-router"
import { toast } from "react-toastify";

export const useInterview =()=>{
    const context = useContext(InterviewContext);
     const { interviewId } = useParams()

    if(!context){
        throw new Error("useContext should be used inside InterviewProvider")
    }

    const {loading,setloading,report,setReport,reports,setReports}=context;
const generateReport =async({jobDescription,selfDescription,resumeFile})=>{
     setloading(true)
     let response = null
try {
     response = await generateInterviewReport({jobDescription,selfDescription,resumeFile});
    setReport(response.interviewReport)
} catch (error) {
   toast.error(error.response.data.message);
}finally{
    setloading(false)
}
     return response.interviewReport

}

const getReportById = async (interviewId) => {
    setloading(true)
     let response = null
    try {
        response = await getInterviewReportById(interviewId)
        setReport(response.interviewReport)
    } catch (error) {
        console.log(error)
    } finally {
        setloading(false)
    }
     return response.interviewReport
}

const getReports = async () => {
    setloading(true)
      let response = null
    try {
         response = await getAllInterviewReports()
        setReports(response.interviewReports)
    } catch (error) {
        console.log(error)
    } finally {
        setloading(false)
    }
     return response.interviewReport
}

 const getResumePdf = async (interviewReportId) => {
        setloading(true)
        let response = null
        try {
            response = await generateResumePdf({ interviewReportId })
            const url = window.URL.createObjectURL(new Blob([ response ], { type: "application/pdf" }))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `resume_${interviewReportId}.pdf`)
            document.body.appendChild(link)
            link.click()
        }
        catch (error) {
            console.log(error)
        } finally {
            setloading(false)
        }
    }

 useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        } else {
            getReports()
        }
    }, [ interviewId ])
    
return { loading, report, reports, generateReport, getReportById, getReports,getResumePdf }
}



