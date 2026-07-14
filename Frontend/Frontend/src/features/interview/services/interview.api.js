import axios from "axios";

const api = axios.create({
    // Points to the base backend URL set in Vercel environment variables
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

/**
 * @description Service to generate interview report
 */
export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile }) => {
    const formData = new FormData();
    formData.append("jobDescription", jobDescription);
    formData.append("selfDescription", selfDescription);
    if (resumeFile) formData.append("resume", resumeFile);

    // Re-routed endpoint to prevent trailing slash errors
    const response = await api.post("/interview", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return response.data;
};

/**
 * @description Service to get interview report by interviewId
 */
export const getInterviewReportById = async (interviewId) => {
    const response = await api.get(`/interview/report/${interviewId}`);
    return response.data;
};

/**
 * @description Service to get all interview reports
 */
export const getAllInterviewReports = async () => {
    const response = await api.get("/interview");
    return response.data;
};

/**
 * @description Service to generate and return a PDF blob
 */
export const generateResumePdf = async ({ interviewReportId }) => {
    const response = await api.post(`/interview/resume/pdf/${interviewReportId}`, null, {
        responseType: "blob"
    });

    return response.data;
};