import { createContext, useState } from "react";


export const InterviewContext =createContext();

export const InterviewProvider =({children}) =>{
    const [loading, setloading] = useState(false)
    const [report, setReport] = useState(null)
    const [reports, setReports] = useState([])

    return (
        <InterviewContext.Provider value={{loading,setloading,report,setReport,reports,setReports}}>
         {children}
        </InterviewContext.Provider>
    )
}