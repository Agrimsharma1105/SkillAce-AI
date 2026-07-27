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

    page.setDefaultNavigationTimeout(60000);
    page.setDefaultTimeout(60000);

    await page.setContent(htmlContent, {
        waitUntil: "domcontentloaded"
    });

    const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
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

   const prompt = `
Generate a professional, ATS-friendly resume for the candidate using the information below.

Candidate Information

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}

Your response MUST be a valid JSON object with ONLY one field:

{
  "html": "<complete html document>"
}

Requirements for the HTML:

- Return a complete HTML document starting with <!DOCTYPE html>.
- Include all CSS inside a single <style> tag.
- Do NOT include any JavaScript.
- Do NOT use Bootstrap.
- Do NOT use Tailwind CSS.
- Do NOT use Google Fonts.
- Do NOT use CDN links.
- Do NOT use external CSS files.
- Do NOT use external images or logos.
- Do NOT reference any remote resources.
- Use only system fonts such as Arial, Helvetica, or sans-serif.
- The HTML must be completely self-contained and render correctly without internet access.

Resume Requirements:

- Tailor the resume specifically for the provided job description.
- Optimize it for ATS (Applicant Tracking Systems).
- Use clear section headings.
- Highlight the candidate's most relevant skills and experience.
- Rewrite and improve the resume content where appropriate while keeping it truthful.
- Make the resume sound natural and professionally written, not AI-generated.
- Keep the design modern, clean, and minimal.
- Use subtle colors and professional typography.
- Keep the resume within one page whenever possible (maximum two pages).
- Include sections only when relevant, such as:
  - Professional Summary
  - Technical Skills
  - Experience
  - Projects
  - Education
  - Certifications
  - Achievements

Return ONLY the JSON object.
Do not wrap the response in markdown.
Do not include explanations.
Do not include code fences.
`;

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