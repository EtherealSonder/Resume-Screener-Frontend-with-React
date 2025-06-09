import axios from "axios";
import BASE_URL from "../baseURL";

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // needed for sessions or secure cookies
});

// Auth
export const loginUser = (email, password) =>
    api.post("/login", { email, password });

export const signupUser = (name, email, password) =>
    api.post("/signup", { name, email, password });

// Jobs
export const createJob = (jobData) => api.post("/jobs/create", jobData);

export const updateJob = (jobId, updatedJob) =>
    api.patch(`/jobs/${jobId}`, updatedJob);

export const deleteJob = (jobId) => api.delete(`/jobs/${jobId}`);

export const getJobById = (jobId) => api.get(`/jobs/${jobId}`);

export const getJobs = (clientId) =>
    api.get("/jobs", { params: { client_id: clientId } });

// Statistics
export const getScoreDistributions = (jobTitles) =>
    api.get("/statistics/distributions", {
        params: { job_titles: jobTitles },
    });

export const getSkillInsights = (clientId, jobTitles) =>
    api.get("/statistics/skills", {
        params: { client_id: clientId, job_titles: jobTitles },
    });

export const getSkillBubbleData = (clientId, type) =>
    api.get("/statistics/skills/bubble", {
        params: { client_id: clientId, type },
    });

export const getSkillGridData = (clientId, type) =>
    api.get("/statistics/skills/grid", {
        params: { client_id: clientId, type },
    });

export const getCandidates = (clientId) =>
    api.get("/candidates", {
        params: { client_id: clientId },
    });

export const getGroupedBarData = (clientId, type) =>
    api.get("/statistics/skills/grouped_bar", {
        params: { client_id: clientId, type },
    });

export const getRadarData = (clientId, type, jobTitles) =>
    api.get("/statistics/skills/radar", {
        params: { client_id: clientId, type, job_titles: jobTitles },
    });

export const updateUser = (payload) =>
    api.post("/update_user", payload);

export const verifyPassword = (payload) =>
    api.post("/verify_password", payload);

export const updatePassword = (payload) =>
    api.post("/update_password", payload);

export const deleteUser = (id) => {
    return api.post("/delete_user", { id });
};

export const getClientPreferences = (clientId) =>
    api.get(`/client_preferences`, { params: { client_id: clientId } });

// Update evaluation prompt and weights
export const updateClientPreferences = (clientId, customPrompt, weights) =>
    api.post(`/client_preferences/update`, {
        client_id: clientId,
        custom_eval_prompt: customPrompt,
        weights: weights
    });

export default api;
