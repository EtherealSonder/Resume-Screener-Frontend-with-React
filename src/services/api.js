import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000", // update if using ngrok or different host
});

export const loginUser = (email, password) =>
    api.post("/login", { email, password });

export const signupUser = (name, email, password) =>
    api.post("/signup", { name, email, password });

export default api;