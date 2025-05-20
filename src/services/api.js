import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000", // update if using ngrok or different host
});

export const loginUser = (email, password) =>
    api.post("/login", { email, password });

export const signupUser = (name, email, password) =>
    api.post("/signup", { name, email, password });

export const updateJob = (jobId, updatedJob) =>
    api.patch(`/jobs/${jobId}`, updatedJob);

export const deleteJob = (jobId) =>
    api.delete(`/jobs/${jobId}`);

export const getJobById = (jobId) => api.get(`/jobs/${jobId}`);

export const getScoreDistributions = (jobTitles) =>
    api.get("/statistics/distributions", {
        params: { job_titles: jobTitles }
    });

export default api;