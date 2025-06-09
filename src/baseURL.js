// src/baseURL.js
const isLocal = window.location.hostname === "localhost";

const BASE_URL = isLocal
    ? "http://localhost:5000"                         // Local backend
    : "https://resume-webhook.onrender.com";         // Deployed backend

export default BASE_URL;
