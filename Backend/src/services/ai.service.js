const { GoogleGenAI } = require("@google/genai");
const {z} = require("zod");
const {zodToJsonSchema} = require("zod-to-json-schema")
const userModel = require("../models/user.model");
const puppeteer = require("puppeteer")


// const ai = new GoogleGenAI({
//     apiKey:process.env.GOOGLE_GENAI_API_KEY
// })


const interviewReportSchema = z.object({
  matchScore: z.number().describe(
  "A score between 0 and 100 indicating how well the candidate's profile matches the job requirements"
),
  technicalQuestions: z.array(
    z.object({
      question: z
        .string()
        .describe("The technical question that can be asked in the interview"),

      intention: z
        .string()
        .describe("The intention of interviewer behind asking this question"),

      answer: z
        .string()
        .describe(
          "How to answer this question, what points to cover, what approach to follow"
        ),
    })
  ).describe(
    "Technical questions that can be asked in the interview along with their intention and answers"
  ),

  behavioralQuestions: z.array(
    z.object({
      question: z
        .string()
        .describe("The behavioral question that can be asked in the interview"),

      intention: z
        .string()
        .describe("The intention of interviewer behind asking this question"),

      answer: z
        .string()
        .describe(
          "How to answer this question, what points to cover, what approach to follow"
        ),
    })
  ).describe(
    "Behavioral questions that can be asked in the interview along with their intention and answers"
  ),

  skillGaps: z.array(
    z.object({
      skill: z
        .string()
        .describe("The skill which the candidate is lacking"),

      severity: z
        .enum(["low", "medium", "high"])
        .describe(
          "The severity of this skill gap"
        ),
    })
  ).describe(
    "List of skill gaps in the candidate's profile along with their severity"
  ),

  preparationPlan: z.array(
    z.object({
      day: z
        .number()
        .describe(
          "The day number in the preparation plan"
        ),

      focus: z
        .string()
        .describe(
          "The main focus of this day in the preparation plan"
        ),

      tasks: z
        .array(z.string())
        .describe(
          "List of tasks to be done on this day"
        ),
    })
  ).describe(
    "A day-wise preparation plan for the candidate"
  ),
  title: z.string().describe("The title of the job for which the report is generated")
});


async function generateInterviewReport({
    userId,
    resume,
    selfDescription,
    jobDescription
}){
    const user = await userModel.findById(userId);

    if (!user || !user.geminiApiKey) {
        throw new Error("Gemini API Key not found");
    }

    const ai = new GoogleGenAI({
        apiKey: user.geminiApiKey
    });
  const prompt = `Generate an interview report for a candidate with the following details:
    Resume: ${resume}
    Self Description: ${selfDescription}
    Job Description: ${jobDescription}`
  
 
  const response = await ai.models.generateContent({
        model:"gemini-2.5-flash",
        contents:prompt,
        config:{
           responseMimeType:"application/json",
           responseSchema:zodToJsonSchema(interviewReportSchema)
        }
    })
   return JSON.parse(response.text)
}



async function generatePdfFromHtml(htmlContent) {

    const browser = await puppeteer.launch({
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
        headless: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox"
        ]
    });

    const page = await browser.newPage();

    await page.setContent(htmlContent, {
        waitUntil: "networkidle0"
    });

    const pdfBuffer = await page.pdf({
        format: "A4",
        margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    });

    await browser.close();

    return pdfBuffer;
}


async function generateResumePdf({ userId, resume, selfDescription, jobDescription }) {
  const user = await userModel.findById(userId);

if (!user || !user.geminiApiKey) {
    throw new Error("Gemini API Key not found");
}

const ai = new GoogleGenAI({
    apiKey: user.geminiApiKey
});

    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumePdfSchema),
        }
    })


    const jsonContent = JSON.parse(response.text)

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer

}

module.exports = { generateInterviewReport, generateResumePdf }