module.exports = {
    content: ["./index.html", "./src/**/*.{js,jsx}"],
    theme: {
        extend: {
            fontFamily: {
                sans: ["DM Sans", "sans-serif"],
            },
            colors: {
                graylupa: {
                    bg: "#f5f6f8",
                    surface: "#ffffff",
                    border: "#d1d5db",
                    text: "#1f2937",
                    muted: "#6b7280",
                    accent: "#4b5563",
                    primary: "#374151",
                    highlight: "#10b981",
                    warning: "#f59e0b",
                    error: "#ef4444",
                },
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0", transform: "translateY(20px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
            },
            animation: {
                fadeIn: "fadeIn 0.6s ease-in-out forwards",
            },
        },
    },
    plugins: [],
};
